package com.univibe.group.web;

import com.univibe.common.dto.PageResponse;
import com.univibe.group.dto.GroupJoinRequestDTO;
import com.univibe.group.dto.GroupResponseDTO;
import com.univibe.group.model.Group;
import com.univibe.group.model.GroupJoinRequest;
import com.univibe.group.model.GroupJoinRequestStatus;
import com.univibe.group.model.GroupPrivacy;
import com.univibe.group.repo.GroupJoinRequestRepository;
import com.univibe.group.repo.GroupRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import com.univibe.gamification.event.GroupCreatedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import org.springframework.util.StringUtils;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupJoinRequestRepository joinRequestRepository;
    private final ApplicationEventPublisher publisher;

    @PersistenceContext
    private EntityManager entityManager;

    public GroupController(
            GroupRepository groupRepository,
            UserRepository userRepository,
            GroupJoinRequestRepository joinRequestRepository,
            ApplicationEventPublisher publisher
    ) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.joinRequestRepository = joinRequestRepository;
        this.publisher = publisher;
    }

    @GetMapping
    public PageResponse<GroupResponseDTO> list(
            @RequestParam Optional<String> search,
            @PageableDefault(size = 8, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        var page = search.filter(StringUtils::hasText)
                .map(String::trim)
                .map(query -> groupRepository.findByNameContainingIgnoreCase(query, pageable))
                .orElseGet(() -> groupRepository.findAll(pageable));
        var dtoPage = page.map(GroupResponseDTO::new);
        return PageResponse.from(dtoPage);
    }

    @GetMapping("/{groupId}")
    public GroupResponseDTO get(@PathVariable Long groupId, Authentication auth) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        GroupResponseDTO dto = new GroupResponseDTO(group);
        if (auth != null) {
            userRepository.findByEmail((String) auth.getPrincipal()).ifPresent(requester -> {
                boolean isMember = group.getMembers().stream().anyMatch(member -> member.getId().equals(requester.getId()));
                if (!isMember) {
                    boolean pending = joinRequestRepository
                            .findByGroupIdAndUserIdAndStatus(groupId, requester.getId(), GroupJoinRequestStatus.PENDING)
                            .isPresent();
                    dto.setPendingJoinRequest(pending);
                }
            });
        }
        return dto;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public GroupResponseDTO create(
            Authentication auth,
            @RequestParam @NotBlank String name,
            @RequestParam(defaultValue = "PUBLIC") GroupPrivacy privacy
    ) {
        String email = (String) auth.getPrincipal();
        User owner = userRepository.findByEmail(email).orElseThrow();
        Group g = new Group();
        g.setName(name);
        g.setOwner(owner);
        g.setPrivacy(privacy);
        g.getMembers().add(owner);
        Group savedGroup = groupRepository.save(g);
        
        // Publish event for achievements
        publisher.publishEvent(new GroupCreatedEvent(this, owner, savedGroup.getId()));
        
        return new GroupResponseDTO(savedGroup);
    }

    @PostMapping("/{groupId}/join")
    @Transactional
    public ResponseEntity<?> join(
            @PathVariable Long groupId,
            @RequestParam(required = false) Long userId,
            Authentication auth
    ) {
        User user;
        if (userId != null) {
            user = userRepository.findById(userId).orElseThrow();
        } else {
            if (auth == null) {
                return ResponseEntity.status(401).build();
            }
            String email = (String) auth.getPrincipal();
            user = userRepository.findByEmail(email).orElseThrow();
        }
        Group g = groupRepository.findById(groupId).orElseThrow();

        boolean alreadyMember = g.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()));
        if (alreadyMember) {
            return ResponseEntity.ok(Map.of(
                    "status", "ALREADY_MEMBER",
                    "group", new GroupResponseDTO(g)
            ));
        }

        if (g.getPrivacy() == GroupPrivacy.PUBLIC) {
            g.getMembers().add(user);
            groupRepository.save(g);
            return ResponseEntity.ok(Map.of(
                    "status", "JOINED",
                    "message", "Te has unido al grupo",
                    "group", new GroupResponseDTO(g)
            ));
        }

        // PRIVATE group
        var existingRequest = joinRequestRepository.findByGroupIdAndUserIdAndStatus(
                groupId, user.getId(), GroupJoinRequestStatus.PENDING
        );
        if (existingRequest.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "status", "PENDING",
                    "message", "Ya enviaste una solicitud. Espera la aprobación del creador."
            ));
        }

        GroupJoinRequest request = new GroupJoinRequest();
        request.setGroup(g);
        request.setUser(user);
        joinRequestRepository.save(request);

        return ResponseEntity.ok(Map.of(
                "status", "PENDING",
                "message", "Solicitud enviada. El creador debe aprobar tu ingreso."
        ));
    }

    @GetMapping("/{groupId}/join-requests")
    public ResponseEntity<?> listJoinRequests(@PathVariable Long groupId, Authentication auth) {
        User requester = userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        if (!canManageGroup(group, requester)) {
            return ResponseEntity.status(403).build();
        }
        List<GroupJoinRequestDTO> pending = joinRequestRepository
                .findByGroupIdAndStatus(groupId, GroupJoinRequestStatus.PENDING)
                .stream()
                .map(GroupJoinRequestDTO::new)
                .toList();
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/{groupId}/join-requests/{requestId}/approve")
    public ResponseEntity<?> approveJoinRequest(
            @PathVariable Long groupId,
            @PathVariable Long requestId,
            Authentication auth
    ) {
        return handleJoinRequestUpdate(groupId, requestId, auth, true);
    }

    @PostMapping("/{groupId}/join-requests/{requestId}/reject")
    public ResponseEntity<?> rejectJoinRequest(
            @PathVariable Long groupId,
            @PathVariable Long requestId,
            Authentication auth
    ) {
        return handleJoinRequestUpdate(groupId, requestId, auth, false);
    }

    private ResponseEntity<?> handleJoinRequestUpdate(Long groupId, Long requestId, Authentication auth, boolean approve) {
        User requester = userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        if (!canManageGroup(group, requester)) {
            return ResponseEntity.status(403).build();
        }

        GroupJoinRequest request = joinRequestRepository.findById(requestId).orElseThrow();
        if (!request.getGroup().getId().equals(groupId) || request.getStatus() != GroupJoinRequestStatus.PENDING) {
            return ResponseEntity.badRequest().body(Map.of("error", "Solicitud inválida"));
        }

        if (approve) {
            request.setStatus(GroupJoinRequestStatus.APPROVED);
            group.getMembers().add(request.getUser());
            groupRepository.save(group);
            joinRequestRepository.save(request);
            return ResponseEntity.ok(Map.of(
                    "status", "APPROVED",
                    "group", new GroupResponseDTO(group)
            ));
        } else {
            request.setStatus(GroupJoinRequestStatus.REJECTED);
            joinRequestRepository.save(request);
            return ResponseEntity.ok(Map.of("status", "REJECTED"));
        }
    }

    private boolean canManageGroup(Group group, User user) {
        if (user == null || group == null) {
            return false;
        }
        return group.getOwner().getId().equals(user.getId())
                || user.getRole() == com.univibe.user.model.Role.ADMIN
                || user.getRole() == com.univibe.user.model.Role.SERVER;
    }

    @PostMapping("/{groupId}/toggle-chat")
    @Transactional
    public ResponseEntity<?> toggleChat(@PathVariable Long groupId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        
        if (!canManageGroup(group, user)) {
            return ResponseEntity.status(403).body(Map.of("error", "Solo el creador del grupo o un administrador pueden modificar esta configuración"));
        }
        
        Boolean currentValue = group.getMembersCanChat();
        Boolean newValue = (currentValue == null || !currentValue) ? true : false;
        group.setMembersCanChat(newValue);
        groupRepository.save(group);
        
        return ResponseEntity.ok(Map.of(
                "membersCanChat", newValue,
                "message", newValue 
                    ? "Chat habilitado para todos los miembros" 
                    : "Chat restringido a administradores"
        ));
    }

    @DeleteMapping("/{groupId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteGroup(@PathVariable Long groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        
        // Eliminar todas las dependencias antes de eliminar el grupo
        // Esto evita violaciones de restricciones de clave foránea
        entityManager.createNativeQuery("DELETE FROM group_announcements WHERE group_id = :groupId")
                .setParameter("groupId", groupId)
                .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM group_messages WHERE group_id = :groupId")
                .setParameter("groupId", groupId)
                .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM group_events WHERE group_id = :groupId")
                .setParameter("groupId", groupId)
                .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM group_surveys WHERE group_id = :groupId")
                .setParameter("groupId", groupId)
                .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM group_join_requests WHERE group_id = :groupId")
                .setParameter("groupId", groupId)
                .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM group_members WHERE group_id = :groupId")
                .setParameter("groupId", groupId)
                .executeUpdate();
        
        groupRepository.delete(group);
        return ResponseEntity.ok(Map.of("message", "Grupo eliminado exitosamente"));
    }
}

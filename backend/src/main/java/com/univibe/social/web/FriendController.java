package com.univibe.social.web;

import com.univibe.registration.repo.RegistrationRepository;
import com.univibe.social.model.FriendRequest;
import com.univibe.social.model.Friendship;
import com.univibe.social.repo.FriendRequestRepository;
import com.univibe.social.repo.FriendshipRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friends")
public class FriendController {
    private final FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    public FriendController(FriendRequestRepository friendRequestRepository, FriendshipRepository friendshipRepository, UserRepository userRepository, RegistrationRepository registrationRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
    }

    @PostMapping("/request")
    public Map<String, Object> sendFriendRequest(@RequestParam Long receiverId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User sender = userRepository.findByEmail(email).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        if (sender.getId().equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        // Verificar si ya son amigos
        if (friendshipRepository.existsByUser1IdAndUser2Id(sender.getId(), receiverId) ||
            friendshipRepository.existsByUser1IdAndUser2Id(receiverId, sender.getId())) {
            throw new IllegalStateException("Already friends");
        }

        // Verificar si ya existe una solicitud pendiente
        friendRequestRepository.findBySenderIdAndReceiverId(sender.getId(), receiverId)
            .ifPresent(fr -> {
                throw new IllegalStateException("Friend request already sent");
            });
        
        friendRequestRepository.findBySenderIdAndReceiverId(receiverId, sender.getId())
            .ifPresent(fr -> {
                if (fr.getStatus() == FriendRequest.FriendRequestStatus.PENDING) {
                    throw new IllegalStateException("You already have a pending request from this user");
                }
            });

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        friendRequestRepository.save(request);

        return Map.of("id", request.getId(), "status", "sent");
    }

    @GetMapping("/requests")
    public List<Map<String, Object>> getFriendRequests(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        return friendRequestRepository.findByReceiverIdAndStatus(user.getId(), FriendRequest.FriendRequestStatus.PENDING).stream()
            .map(fr -> Map.of(
                "id", fr.getId(),
                "sender", Map.of(
                    "id", fr.getSender().getId(),
                    "name", fr.getSender().getName(),
                    "email", fr.getSender().getEmail(),
                    "profilePictureUrl", fr.getSender().getProfilePictureUrl() != null ? fr.getSender().getProfilePictureUrl() : ""
                ),
                "createdAt", fr.getCreatedAt().toString()
            ))
            .collect(Collectors.toList());
    }

    @PostMapping("/requests/{requestId}/accept")
    public Map<String, Object> acceptFriendRequest(@PathVariable Long requestId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        FriendRequest request = friendRequestRepository.findById(requestId).orElseThrow();
        if (!request.getReceiver().getId().equals(user.getId())) {
            throw new IllegalStateException("Not authorized to accept this request");
        }

        if (request.getStatus() != FriendRequest.FriendRequestStatus.PENDING) {
            throw new IllegalStateException("Request already processed");
        }

        request.setStatus(FriendRequest.FriendRequestStatus.ACCEPTED);
        friendRequestRepository.save(request);

        // Crear amistad (asegurar que user1 < user2 para evitar duplicados)
        Long user1Id = Math.min(request.getSender().getId(), request.getReceiver().getId());
        Long user2Id = Math.max(request.getSender().getId(), request.getReceiver().getId());
        
        Friendship friendship = new Friendship();
        friendship.setUser1(userRepository.findById(user1Id).orElseThrow());
        friendship.setUser2(userRepository.findById(user2Id).orElseThrow());
        friendshipRepository.save(friendship);

        return Map.of("id", friendship.getId(), "status", "accepted");
    }

    @PostMapping("/requests/{requestId}/reject")
    public Map<String, Object> rejectFriendRequest(@PathVariable Long requestId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        FriendRequest request = friendRequestRepository.findById(requestId).orElseThrow();
        if (!request.getReceiver().getId().equals(user.getId())) {
            throw new IllegalStateException("Not authorized to reject this request");
        }

        request.setStatus(FriendRequest.FriendRequestStatus.REJECTED);
        friendRequestRepository.save(request);

        return Map.of("id", requestId, "status", "rejected");
    }

    @GetMapping
    public List<Map<String, Object>> getFriends(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        return friendshipRepository.findByUser1IdOrUser2Id(user.getId(), user.getId()).stream()
            .map(f -> {
                User friend = f.getUser1().getId().equals(user.getId()) ? f.getUser2() : f.getUser1();
                Map<String, Object> result = new HashMap<>();
                result.put("id", friend.getId());
                result.put("name", friend.getName());
                result.put("email", friend.getEmail());
                result.put("profilePictureUrl", friend.getProfilePictureUrl() != null ? friend.getProfilePictureUrl() : "");
                result.put("points", friend.getPoints());
                return result;
            })
            .collect(Collectors.toList());
    }

    @GetMapping("/recommendations")
    public List<Map<String, Object>> getRecommendations(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        // Obtener eventos donde el usuario está registrado
        List<Long> userEventIds = registrationRepository.findByUserId(user.getId()).stream()
            .map(r -> r.getEvent().getId())
            .distinct()
            .collect(Collectors.toList());

        if (userEventIds.isEmpty()) {
            return List.of();
        }

        // Obtener usuarios que están registrados en los mismos eventos (consulta optimizada)
        List<Long> recommendedUserIds = registrationRepository.findUserIdsByEventIdsExcludingUser(userEventIds, user.getId());

        // Filtrar usuarios que ya son amigos o tienen solicitudes pendientes
        List<Long> friendIds = friendshipRepository.findByUser1IdOrUser2Id(user.getId(), user.getId()).stream()
            .map(f -> f.getUser1().getId().equals(user.getId()) ? f.getUser2().getId() : f.getUser1().getId())
            .collect(Collectors.toList());

        List<Long> pendingRequestUserIds = friendRequestRepository.findBySenderIdAndStatus(user.getId(), FriendRequest.FriendRequestStatus.PENDING).stream()
            .map(fr -> fr.getReceiver().getId())
            .collect(Collectors.toList());
        pendingRequestUserIds.addAll(
            friendRequestRepository.findByReceiverIdAndStatus(user.getId(), FriendRequest.FriendRequestStatus.PENDING).stream()
                .map(fr -> fr.getSender().getId())
                .collect(Collectors.toList())
        );

        return recommendedUserIds.stream()
            .filter(id -> !friendIds.contains(id) && !pendingRequestUserIds.contains(id))
            .map(id -> {
                User recommended = userRepository.findById(id).orElseThrow();
                Map<String, Object> result = new HashMap<>();
                result.put("id", recommended.getId());
                result.put("name", recommended.getName());
                result.put("email", recommended.getEmail());
                result.put("profilePictureUrl", recommended.getProfilePictureUrl() != null ? recommended.getProfilePictureUrl() : "");
                result.put("points", recommended.getPoints());
                return result;
            })
            .limit(10) // Limitar a 10 recomendaciones
            .collect(Collectors.toList());
    }
}


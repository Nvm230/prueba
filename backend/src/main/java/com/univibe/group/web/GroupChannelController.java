package com.univibe.group.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univibe.chat.service.MessageResponseMapper;
import com.univibe.common.dto.PageResponse;
import com.univibe.event.model.Event;
import com.univibe.event.model.EventVisibility;
import com.univibe.event.service.EventSecurityService;
import com.univibe.event.repo.EventRepository;
import com.univibe.group.dto.GroupMessageRequest;
import com.univibe.group.dto.GroupMessageResponse;
import com.univibe.group.model.Group;
import com.univibe.group.model.GroupAnnouncement;
import com.univibe.group.model.GroupEvent;
import com.univibe.group.model.GroupMessage;
import com.univibe.group.model.GroupSurvey;
import com.univibe.group.repo.*;
import com.univibe.media.model.FileScope;
import com.univibe.media.model.StoredFile;
import com.univibe.media.service.FileStorageService;
import com.univibe.survey.model.Survey;
import com.univibe.survey.model.SurveyQuestion;
import com.univibe.survey.repo.SurveyRepository;
import com.univibe.sticker.model.Sticker;
import com.univibe.sticker.service.StickerService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups/{groupId}/channel")
public class GroupChannelController {
    private final GroupRepository groupRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final GroupAnnouncementRepository groupAnnouncementRepository;
    private final GroupEventRepository groupEventRepository;
    private final GroupSurveyRepository groupSurveyRepository;
    private final EventRepository eventRepository;
    private final SurveyRepository surveyRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final EventSecurityService eventSecurityService;
    private final FileStorageService fileStorageService;
    private final StickerService stickerService;
    private final MessageResponseMapper messageResponseMapper;

    public GroupChannelController(
            GroupRepository groupRepository,
            GroupMessageRepository groupMessageRepository,
            GroupAnnouncementRepository groupAnnouncementRepository,
            GroupEventRepository groupEventRepository,
            GroupSurveyRepository groupSurveyRepository,
            EventRepository eventRepository,
            SurveyRepository surveyRepository,
            UserRepository userRepository,
            SimpMessagingTemplate messagingTemplate,
            ObjectMapper objectMapper,
            EventSecurityService eventSecurityService,
            FileStorageService fileStorageService,
            StickerService stickerService,
            MessageResponseMapper messageResponseMapper) {
        this.groupRepository = groupRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.groupAnnouncementRepository = groupAnnouncementRepository;
        this.groupEventRepository = groupEventRepository;
        this.groupSurveyRepository = groupSurveyRepository;
        this.eventRepository = eventRepository;
        this.surveyRepository = surveyRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
        this.eventSecurityService = eventSecurityService;
        this.fileStorageService = fileStorageService;
        this.stickerService = stickerService;
        this.messageResponseMapper = messageResponseMapper;
    }

    // Verificar que el usuario puede enviar mensajes al grupo
    private boolean canSendToGroup(Group group, User user) {
        // Si el chat está habilitado para miembros, cualquier miembro puede enviar
        Boolean membersCanChat = group.getMembersCanChat();
        if (membersCanChat != null && membersCanChat) {
            return isMember(group, user);
        }
        // Si no está habilitado, solo owner/admin/server pueden enviar
        return group.getOwner().getId().equals(user.getId()) ||
               user.getRole().name().equals("SERVER") ||
               user.getRole().name().equals("ADMIN");
    }

    // Verificar que el usuario es miembro del grupo
    private boolean isMember(Group group, User user) {
        return group.getMembers().stream().anyMatch(m -> m.getId().equals(user.getId()));
    }

    @MessageMapping("/group.{groupId}.send")
    public void sendMessage(@DestinationVariable Long groupId, @Payload String payload, Authentication auth) {
        try {
            String email = (String) auth.getPrincipal();
            User sender = userRepository.findByEmail(email).orElseThrow();
            Group group = groupRepository.findById(groupId).orElseThrow();

            // Solo owner/SERVER/ADMIN pueden enviar mensajes
            if (!canSendToGroup(group, sender)) {
                return;
            }

            GroupMessageRequest request = objectMapper.readValue(payload, GroupMessageRequest.class);

            // Guardar mensaje
            GroupMessage message = new GroupMessage();
            message.setGroup(group);
            message.setSender(sender);
            message.setContent(request.getContent());

            if (request.getStickerId() != null) {
                Sticker sticker = stickerService.findById(request.getStickerId());
                if (sticker != null) {
                    message.setSticker(sticker);
                    message.setAttachment(sticker.getFile());
                    message.setFileType(sticker.getFile().getContentType());
                    message.setFileName(sticker.getNombre());
                    message.setFileUrl("/api/files/" + sticker.getFile().getId());
                }
            } else if (request.getFileId() != null) {
                StoredFile storedFile = fileStorageService.findById(request.getFileId());
                if (storedFile != null) {
                    if (storedFile.getScope() != FileScope.GROUP_CHAT || storedFile.getScopeId() == null || !storedFile.getScopeId().equals(groupId)) {
                        throw new IllegalArgumentException("El archivo no corresponde a este grupo");
                    }
                    message.setAttachment(storedFile);
                    message.setFileType(storedFile.getContentType());
                    message.setFileName(storedFile.getFileName());
                    message.setFileUrl("/api/files/" + storedFile.getId());
                }
            } else {
                message.setFileUrl(request.getFileUrl());
                message.setFileType(request.getFileType());
                message.setFileName(request.getFileName());
            }
            GroupMessage saved = groupMessageRepository.save(message);
            GroupMessageResponse response = messageResponseMapper.toGroupResponse(saved);

            // Enviar por WebSocket a todos los miembros del grupo
            messagingTemplate.convertAndSend("/topic/groups." + groupId, objectMapper.writeValueAsString(response));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/messages")
    public PageResponse<GroupMessageResponse> getMessages(
            @PathVariable Long groupId,
            Authentication auth,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        // Verificar que es miembro
        if (!isMember(group, user)) {
            throw new org.springframework.security.access.AccessDeniedException("Not a member of this group");
        }

        var page = groupMessageRepository.findByGroupIdOrderByCreatedAtAsc(groupId, pageable);
        return PageResponse.from(page.map(messageResponseMapper::toGroupResponse));
    }

    @PostMapping("/announcements")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Map<String, Object> createAnnouncement(
            @PathVariable Long groupId,
            @RequestParam String title,
            @RequestParam String content,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        User sender = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        if (!canSendToGroup(group, sender)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        GroupAnnouncement announcement = new GroupAnnouncement();
        announcement.setGroup(group);
        announcement.setSender(sender);
        announcement.setTitle(title);
        announcement.setContent(content);
        GroupAnnouncement saved = groupAnnouncementRepository.save(announcement);

        return Map.of("id", saved.getId(), "title", saved.getTitle());
    }

    @GetMapping("/announcements")
    public PageResponse<Map<String, Object>> getAnnouncements(
            @PathVariable Long groupId,
            Authentication auth,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        if (!isMember(group, user)) {
            throw new org.springframework.security.access.AccessDeniedException("Not a member of this group");
        }

        var page = groupAnnouncementRepository.findByGroupIdOrderByCreatedAtDesc(groupId, pageable);
        return PageResponse.from(page.map(ann -> Map.of(
                "id", ann.getId(),
                "title", ann.getTitle(),
                "content", ann.getContent(),
                "sender", Map.of(
                        "id", ann.getSender().getId(),
                        "name", ann.getSender().getName(),
                        "email", ann.getSender().getEmail()
                ),
                "createdAt", ann.getCreatedAt().toString()
        )));
    }

    @PostMapping("/events/create")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Map<String, Object> createAndShareEvent(
            @PathVariable Long groupId,
            @RequestBody com.univibe.event.dto.EventCreateRequest req,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        User sender = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        if (!canSendToGroup(group, sender)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        // Crear evento
        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setCategory(req.getCategory());
        event.setDescription(req.getDescription());
        event.setFaculty(req.getFaculty() != null && !req.getFaculty().trim().isEmpty() ? req.getFaculty() : null);
        event.setCareer(req.getCareer() != null && !req.getCareer().trim().isEmpty() ? req.getCareer() : null);
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setCreatedBy(sender);
        event.setCheckInPassword(eventSecurityService.generateCheckInPassword());
        event.setVisibility(EventVisibility.PRIVATE);
        Event savedEvent = eventRepository.save(event);

        // Compartir en el grupo
        GroupEvent groupEvent = new GroupEvent();
        groupEvent.setGroup(group);
        groupEvent.setEvent(savedEvent);
        groupEvent.setSharedBy(sender);
        groupEventRepository.save(groupEvent);

        return Map.of("id", groupEvent.getId(), "eventId", savedEvent.getId());
    }

    @PostMapping("/events/{eventId}/share")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Map<String, Object> shareEvent(
            @PathVariable Long groupId,
            @PathVariable Long eventId,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        User sender = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        if (!canSendToGroup(group, sender)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        if (groupEventRepository.existsByGroupIdAndEventId(groupId, eventId)) {
            throw new IllegalStateException("Event already shared in this group");
        }

        GroupEvent groupEvent = new GroupEvent();
        groupEvent.setGroup(group);
        groupEvent.setEvent(event);
        groupEvent.setSharedBy(sender);
        groupEventRepository.save(groupEvent);

        return Map.of("id", groupEvent.getId(), "eventId", eventId);
    }

    @GetMapping("/events")
    public List<Map<String, Object>> getSharedEvents(@PathVariable Long groupId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        if (!isMember(group, user)) {
            throw new org.springframework.security.access.AccessDeniedException("Not a member of this group");
        }

        return groupEventRepository.findByGroupIdOrderByCreatedAtDesc(groupId).stream()
                .map(ge -> Map.of(
                        "id", ge.getId(),
                        "event", Map.of(
                                "id", ge.getEvent().getId(),
                                "title", ge.getEvent().getTitle(),
                                "description", ge.getEvent().getDescription() != null ? ge.getEvent().getDescription() : "",
                                "category", ge.getEvent().getCategory(),
                                "visibility", ge.getEvent().getVisibility().name(),
                                "status", ge.getEvent().getStatus().name(),
                                "startTime", ge.getEvent().getStartTime() != null ? ge.getEvent().getStartTime().toString() : "",
                                "endTime", ge.getEvent().getEndTime() != null ? ge.getEvent().getEndTime().toString() : ""
                        ),
                        "sharedBy", Map.of(
                                "id", ge.getSharedBy().getId(),
                                "name", ge.getSharedBy().getName()
                        ),
                        "createdAt", ge.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/surveys/{surveyId}/share")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Map<String, Object> shareSurvey(
            @PathVariable Long groupId,
            @PathVariable Long surveyId,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        User sender = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        Survey survey = surveyRepository.findById(surveyId).orElseThrow();

        if (!canSendToGroup(group, sender)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        if (groupSurveyRepository.existsByGroupIdAndSurveyId(groupId, surveyId)) {
            throw new IllegalStateException("Survey already shared in this group");
        }

        GroupSurvey groupSurvey = new GroupSurvey();
        groupSurvey.setGroup(group);
        groupSurvey.setSurvey(survey);
        groupSurvey.setSharedBy(sender);
        groupSurveyRepository.save(groupSurvey);

        return Map.of("id", groupSurvey.getId(), "surveyId", surveyId);
    }

    @PostMapping("/surveys/create")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Map<String, Object> createGroupSurvey(
            @PathVariable Long groupId,
            @RequestParam String title,
            @RequestParam List<String> questions,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        User sender = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        if (!canSendToGroup(group, sender)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        // Crear encuesta sin evento (para grupo)
        Survey survey = new Survey();
        survey.setEvent(null); // Encuesta de grupo, sin evento asociado
        survey.setTitle(title);
        survey.setClosed(false);
        
        for (String q : questions) {
            SurveyQuestion sq = new SurveyQuestion();
            sq.setSurvey(survey);
            sq.setText(q);
            survey.getQuestions().add(sq);
        }
        Survey savedSurvey = surveyRepository.save(survey);

        // Compartir automáticamente en el grupo
        GroupSurvey groupSurvey = new GroupSurvey();
        groupSurvey.setGroup(group);
        groupSurvey.setSurvey(savedSurvey);
        groupSurvey.setSharedBy(sender);
        groupSurveyRepository.save(groupSurvey);

        return Map.of("id", groupSurvey.getId(), "surveyId", savedSurvey.getId());
    }

    @GetMapping("/surveys")
    public List<Map<String, Object>> getSharedSurveys(@PathVariable Long groupId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        if (!isMember(group, user)) {
            throw new org.springframework.security.access.AccessDeniedException("Not a member of this group");
        }

        return groupSurveyRepository.findByGroupIdOrderByCreatedAtDesc(groupId).stream()
                .map(gs -> {
                    Map<String, Object> surveyMap = new HashMap<>();
                    surveyMap.put("id", gs.getSurvey().getId());
                    surveyMap.put("title", gs.getSurvey().getTitle());
                    if (gs.getSurvey().getEvent() != null) {
                        surveyMap.put("event", Map.of(
                                "id", gs.getSurvey().getEvent().getId(),
                                "title", gs.getSurvey().getEvent().getTitle()
                        ));
                    } else {
                        surveyMap.put("event", null);
                    }
                    
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", gs.getId());
                    result.put("survey", surveyMap);
                    result.put("sharedBy", Map.of(
                            "id", gs.getSharedBy().getId(),
                            "name", gs.getSharedBy().getName()
                    ));
                    result.put("createdAt", gs.getCreatedAt().toString());
                    return result;
                })
                .collect(Collectors.toList());
    }
}


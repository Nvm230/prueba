package com.univibe.chat.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univibe.chat.dto.ChatMessageRequest;
import com.univibe.chat.dto.ChatMessageResponse;
import com.univibe.chat.dto.UserInfo;
import com.univibe.chat.model.ChatMessage;
import com.univibe.chat.repo.ChatMessageRepository;
import com.univibe.common.dto.PageResponse;
import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import com.univibe.event.repo.EventRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final EventRepository eventRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public ChatController(
            SimpMessagingTemplate messagingTemplate,
            EventRepository eventRepository,
            ChatMessageRepository chatMessageRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.eventRepository = eventRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @MessageMapping("/chat.{eventId}.send")
    public void send(@DestinationVariable Long eventId, @Payload String payload, Authentication auth) {
        try {
            var event = eventRepository.findById(eventId).orElseThrow();
            if (event.getStatus() != EventStatus.LIVE) {
                return;
            }

            String email = (String) auth.getPrincipal();
            User user = userRepository.findByEmail(email).orElseThrow();

            ChatMessageRequest request = objectMapper.readValue(payload, ChatMessageRequest.class);

            // Guardar mensaje en BD
            ChatMessage message = new ChatMessage();
            message.setEvent(event);
            message.setUser(user);
            message.setContent(request.getContent());
            message.setFileUrl(request.getFileUrl());
            message.setFileType(request.getFileType());
            message.setFileName(request.getFileName());
            ChatMessage saved = chatMessageRepository.save(message);

            // Crear respuesta con información del usuario
            UserInfo userInfo = new UserInfo(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getProfilePictureUrl()
            );
            ChatMessageResponse response = new ChatMessageResponse(
                    saved.getId(),
                    userInfo,
                    saved.getContent(),
                    saved.getFileUrl(),
                    saved.getFileType(),
                    saved.getFileName(),
                    saved.getCreatedAt()
            );

            // Enviar por WebSocket
            messagingTemplate.convertAndSend("/topic/events." + eventId, objectMapper.writeValueAsString(response));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/events/{eventId}/messages")
    public PageResponse<ChatMessageResponse> getMessages(
            @PathVariable Long eventId,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        var page = chatMessageRepository.findByEventIdOrderByCreatedAtAsc(eventId, pageable);
        return PageResponse.from(page.map(msg -> {
            User u = msg.getUser();
            UserInfo userInfo = new UserInfo(
                    u.getId(),
                    u.getName(),
                    u.getEmail(),
                    u.getProfilePictureUrl()
            );
            return new ChatMessageResponse(
                    msg.getId(),
                    userInfo,
                    msg.getContent(),
                    msg.getFileUrl(),
                    msg.getFileType(),
                    msg.getFileName(),
                    msg.getCreatedAt()
            );
        }));
    }
}

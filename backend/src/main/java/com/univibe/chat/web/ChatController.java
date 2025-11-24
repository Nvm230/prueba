package com.univibe.chat.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univibe.chat.dto.ChatMessageRequest;
import com.univibe.chat.dto.ChatMessageResponse;
import com.univibe.chat.model.ChatMessage;
import com.univibe.chat.repo.ChatMessageRepository;
import com.univibe.chat.service.MessageResponseMapper;
import com.univibe.common.dto.PageResponse;
import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import com.univibe.event.repo.EventRepository;
import com.univibe.media.model.FileScope;
import com.univibe.media.model.StoredFile;
import com.univibe.media.service.FileStorageService;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final EventRepository eventRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final StickerService stickerService;
    private final ObjectMapper objectMapper;
    private final MessageResponseMapper messageResponseMapper;

    public ChatController(
            SimpMessagingTemplate messagingTemplate,
            EventRepository eventRepository,
            ChatMessageRepository chatMessageRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper,
            FileStorageService fileStorageService,
            StickerService stickerService,
            MessageResponseMapper messageResponseMapper) {
        this.messagingTemplate = messagingTemplate;
        this.eventRepository = eventRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.fileStorageService = fileStorageService;
        this.stickerService = stickerService;
        this.messageResponseMapper = messageResponseMapper;
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
                    if (storedFile.getScope() != FileScope.EVENT_CHAT || storedFile.getScopeId() == null || !storedFile.getScopeId().equals(eventId)) {
                        throw new IllegalArgumentException("El archivo no corresponde a este evento");
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
            ChatMessage saved = chatMessageRepository.save(message);

            ChatMessageResponse response = messageResponseMapper.toChatResponse(saved);

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
        return PageResponse.from(page.map(messageResponseMapper::toChatResponse));
    }
}

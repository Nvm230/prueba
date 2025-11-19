package com.univibe.social.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univibe.common.dto.PageResponse;
import com.univibe.notification.model.Notification;
import com.univibe.notification.repo.NotificationRepository;
import com.univibe.chat.service.MessageResponseMapper;
import com.univibe.social.dto.PrivateMessageRequest;
import com.univibe.social.dto.PrivateMessageResponse;
import com.univibe.social.model.PrivateMessage;
import com.univibe.social.repo.FriendshipRepository;
import com.univibe.social.repo.PrivateMessageRepository;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/private-messages")
public class PrivateMessageController {
    private final PrivateMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final NotificationRepository notificationRepository;
    private final FileStorageService fileStorageService;
    private final StickerService stickerService;
    private final MessageResponseMapper messageResponseMapper;

    public PrivateMessageController(PrivateMessageRepository messageRepository,
                                    UserRepository userRepository,
                                    FriendshipRepository friendshipRepository,
                                    SimpMessagingTemplate messagingTemplate,
                                    ObjectMapper objectMapper,
                                    NotificationRepository notificationRepository,
                                    FileStorageService fileStorageService,
                                    StickerService stickerService,
                                    MessageResponseMapper messageResponseMapper) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
        this.notificationRepository = notificationRepository;
        this.fileStorageService = fileStorageService;
        this.stickerService = stickerService;
        this.messageResponseMapper = messageResponseMapper;
    }

    @MessageMapping("/private.{receiverId}.send")
    public void sendPrivateMessage(@DestinationVariable Long receiverId, @Payload String payload, Authentication auth) {
        try {
            String email = (String) auth.getPrincipal();
            User sender = userRepository.findByEmail(email).orElseThrow();
            User receiver = userRepository.findById(receiverId).orElseThrow();

            // Verificar que son amigos
            boolean areFriends = friendshipRepository.existsByUser1IdAndUser2Id(sender.getId(), receiverId) ||
                                friendshipRepository.existsByUser1IdAndUser2Id(receiverId, sender.getId());
            if (!areFriends) {
                return; // No son amigos, no enviar mensaje
            }

            PrivateMessageRequest request = objectMapper.readValue(payload, PrivateMessageRequest.class);

            // Guardar mensaje
            PrivateMessage message = new PrivateMessage();
            message.setSender(sender);
            message.setReceiver(receiver);
            message.setContent(request.getContent());

            if (request.getStickerId() != null) {
                Sticker sticker = stickerService.findById(request.getStickerId());
                if (sticker != null && sticker.getFile() != null) {
                    message.setSticker(sticker);
                    message.setAttachment(sticker.getFile());
                    message.setFileType(sticker.getFile().getContentType());
                    message.setFileName(sticker.getNombre());
                    message.setFileUrl("/api/files/" + sticker.getFile().getId());
                } else {
                    throw new IllegalArgumentException("Sticker no encontrado o sin archivo asociado");
                }
            } else if (request.getFileId() != null) {
                StoredFile storedFile = fileStorageService.findById(request.getFileId());
                if (storedFile != null) {
                    if (storedFile.getScope() != FileScope.PRIVATE_CHAT) {
                        throw new IllegalArgumentException("Archivo inválido para chat privado");
                    }
                    if (storedFile.getScopeId() != null && !storedFile.getScopeId().equals(receiver.getId()) && !storedFile.getScopeId().equals(sender.getId())) {
                        throw new IllegalArgumentException("El archivo no corresponde a esta conversación");
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
            message.setMode(request.getCallMode());
            PrivateMessage saved = messageRepository.save(message);
            PrivateMessageResponse response = messageResponseMapper.toPrivateResponse(saved);

            // Crear notificación para el receptor
            Notification notification = new Notification();
            notification.setRecipient(receiver);
            notification.setTitle("Nuevo mensaje de " + sender.getName());
            notification.setMessage(request.getContent().length() > 100 
                ? request.getContent().substring(0, 100) + "..." 
                : request.getContent());
            notificationRepository.save(notification);

            // Enviar notificación por WebSocket
            messagingTemplate.convertAndSend("/queue/notifications." + receiverId, notification);

            // Enviar por WebSocket a ambos usuarios
            messagingTemplate.convertAndSend("/queue/private." + sender.getId(), objectMapper.writeValueAsString(response));
            messagingTemplate.convertAndSend("/queue/private." + receiverId, objectMapper.writeValueAsString(response));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/conversations")
    public List<Map<String, Object>> getConversations(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<Long> partnerIds = messageRepository.findConversationPartnerIds(user.getId());
        return partnerIds.stream()
            .map(partnerId -> {
                User partner = userRepository.findById(partnerId).orElse(null);
                if (partner == null) {
                    return null;
                }
                long unreadCount = messageRepository.countUnreadMessages(user.getId(), partnerId);
                Map<String, Object> result = new HashMap<>();
                result.put("userId", partner.getId());
                result.put("name", partner.getName());
                result.put("email", partner.getEmail());
                result.put("profilePictureUrl", partner.getProfilePictureUrl() != null ? partner.getProfilePictureUrl() : "");
                result.put("unreadCount", unreadCount);
                return result;
            })
            .filter(result -> result != null)
            .collect(Collectors.toList());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        long totalUnread = messageRepository.countUnreadMessagesForUser(user.getId());
        
        Map<String, Long> result = new HashMap<>();
        result.put("count", totalUnread);
        return result;
    }

    @PostMapping("/conversation/{otherUserId}/mark-read")
    @Transactional
    public ResponseEntity<Map<String, Object>> markConversationAsRead(
            @PathVariable Long otherUserId,
            Authentication auth) {
        try {
            String email = (String) auth.getPrincipal();
            User user = userRepository.findByEmail(email).orElseThrow();
            User otherUser = userRepository.findById(otherUserId).orElseThrow();

            // Verificar que son amigos
            boolean areFriends = friendshipRepository.existsByUser1IdAndUser2Id(user.getId(), otherUserId) ||
                                friendshipRepository.existsByUser1IdAndUser2Id(otherUserId, user.getId());
            if (!areFriends) {
                return ResponseEntity.badRequest().body(Map.of("error", "Not friends"));
            }

            // Obtener todos los mensajes no leídos de esta conversación
            var unreadMessages = messageRepository.findConversation(user.getId(), otherUserId, 
                org.springframework.data.domain.PageRequest.of(0, 1000)).getContent()
                .stream()
                .filter(m -> m.getReceiver().getId().equals(user.getId()) && !m.isReadFlag())
                .collect(java.util.stream.Collectors.toList());

            if (!unreadMessages.isEmpty()) {
                // Marcar todos como leídos
                for (var message : unreadMessages) {
                    message.setReadFlag(true);
                }
                messageRepository.saveAll(unreadMessages);
                messageRepository.flush();
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "markedCount", unreadMessages.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/conversation/{otherUserId}")
    @Transactional(readOnly = true)
    public PageResponse<PrivateMessageResponse> getConversation(
            @PathVariable Long otherUserId,
            Authentication auth,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        User otherUser = userRepository.findById(otherUserId).orElseThrow();

        // Verificar que son amigos
        boolean areFriends = friendshipRepository.existsByUser1IdAndUser2Id(user.getId(), otherUserId) ||
                            friendshipRepository.existsByUser1IdAndUser2Id(otherUserId, user.getId());
        if (!areFriends) {
            throw new IllegalStateException("Not friends");
        }

        var page = messageRepository.findConversation(user.getId(), otherUserId, pageable);
        
        // Pre-load LOBs within transaction - cargar attachment lazy manualmente
        for (var message : page.getContent()) {
            // Forzar carga de attachment si existe (lazy loading)
            if (message.getAttachment() != null) {
                try {
                    // Acceder a los campos para forzar la carga
                    Long fileId = message.getAttachment().getId();
                    // Solo acceder a previewBase64 si es necesario, no a data (BYTEA)
                    String preview = message.getAttachment().getPreviewBase64();
                } catch (Exception e) {
                    // Si falla, continuar sin attachment
                    System.err.println("Error loading attachment for message " + message.getId() + ": " + e.getMessage());
                }
            }
            // Cargar sticker.file si existe
            if (message.getSticker() != null) {
                try {
                    // Forzar carga del file si existe (puede ser lazy)
                    var sticker = message.getSticker();
                    if (sticker.getFile() != null) {
                        // Acceder a previewBase64 para forzar la carga dentro de la transacción
                        String stickerPreview = sticker.getFile().getPreviewBase64();
                        // También acceder al ID para asegurar que el file está cargado
                        Long fileId = sticker.getFile().getId();
                    }
                } catch (Exception e) {
                    System.err.println("Error loading sticker file for message " + message.getId() + ": " + e.getMessage());
                }
            }
        }
        
        // Mapear mensajes a respuesta (dentro de la transacción de solo lectura)
        // Los mensajes se marcarán como leídos explícitamente mediante el endpoint /mark-read
        return PageResponse.from(page.map(messageResponseMapper::toPrivateResponse));
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markMessagesAsRead(java.util.List<com.univibe.social.model.PrivateMessage> messages) {
        if (messages.isEmpty()) {
            return;
        }
        // Obtener los IDs de los mensajes para recargarlos en la nueva transacción
        java.util.List<Long> messageIds = messages.stream()
            .map(com.univibe.social.model.PrivateMessage::getId)
            .collect(java.util.stream.Collectors.toList());
        
        // Recargar los mensajes en la nueva transacción para evitar problemas de detach
        java.util.List<com.univibe.social.model.PrivateMessage> messagesToUpdate = messageRepository.findAllById(messageIds);
        
        // Marcar todos los mensajes como leídos
        for (var message : messagesToUpdate) {
            message.setReadFlag(true);
        }
        
        // Guardar todos los mensajes de una vez
        messageRepository.saveAll(messagesToUpdate);
        // Forzar flush para asegurar que los cambios se persistan inmediatamente
        messageRepository.flush();
    }
}


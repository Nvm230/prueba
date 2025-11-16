package com.univibe.social.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univibe.common.dto.PageResponse;
import com.univibe.social.dto.PrivateMessageRequest;
import com.univibe.social.dto.PrivateMessageResponse;
import com.univibe.social.dto.UserInfo;
import com.univibe.social.model.PrivateMessage;
import com.univibe.social.repo.FriendshipRepository;
import com.univibe.social.repo.PrivateMessageRepository;
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

    public PrivateMessageController(PrivateMessageRepository messageRepository, UserRepository userRepository, FriendshipRepository friendshipRepository, SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
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
            message.setFileUrl(request.getFileUrl());
            message.setFileType(request.getFileType());
            message.setFileName(request.getFileName());
            PrivateMessage saved = messageRepository.save(message);

            // Crear respuesta
            UserInfo senderInfo = new UserInfo(sender.getId(), sender.getName(), sender.getEmail(), sender.getProfilePictureUrl());
            UserInfo receiverInfo = new UserInfo(receiver.getId(), receiver.getName(), receiver.getEmail(), receiver.getProfilePictureUrl());
            PrivateMessageResponse response = new PrivateMessageResponse(
                saved.getId(),
                senderInfo,
                receiverInfo,
                saved.getContent(),
                saved.getFileUrl(),
                saved.getFileType(),
                saved.getFileName(),
                saved.isReadFlag(),
                saved.getCreatedAt()
            );

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

        List<User> partners = messageRepository.findConversationPartners(user.getId());
        return partners.stream()
            .map(partner -> {
                long unreadCount = messageRepository.countUnreadMessages(user.getId(), partner.getId());
                Map<String, Object> result = new HashMap<>();
                result.put("userId", partner.getId());
                result.put("name", partner.getName());
                result.put("email", partner.getEmail());
                result.put("profilePictureUrl", partner.getProfilePictureUrl() != null ? partner.getProfilePictureUrl() : "");
                result.put("unreadCount", unreadCount);
                return result;
            })
            .collect(Collectors.toList());
    }

    @GetMapping("/conversation/{otherUserId}")
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
        
        // Marcar mensajes como leídos
        page.getContent().stream()
            .filter(m -> m.getReceiver().getId().equals(user.getId()) && !m.isReadFlag())
            .forEach(m -> {
                m.setReadFlag(true);
                messageRepository.save(m);
            });

        return PageResponse.from(page.map(msg -> {
            UserInfo senderInfo = new UserInfo(
                msg.getSender().getId(),
                msg.getSender().getName(),
                msg.getSender().getEmail(),
                msg.getSender().getProfilePictureUrl()
            );
            UserInfo receiverInfo = new UserInfo(
                msg.getReceiver().getId(),
                msg.getReceiver().getName(),
                msg.getReceiver().getEmail(),
                msg.getReceiver().getProfilePictureUrl()
            );
            return new PrivateMessageResponse(
                msg.getId(),
                senderInfo,
                receiverInfo,
                msg.getContent(),
                msg.getFileUrl(),
                msg.getFileType(),
                msg.getFileName(),
                msg.isReadFlag(),
                msg.getCreatedAt()
            );
        }));
    }
}


package com.univibe.reaction.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.univibe.chat.model.ChatMessage;
import com.univibe.chat.repo.ChatMessageRepository;
import com.univibe.chat.service.MessageResponseMapper;
import com.univibe.group.model.GroupMessage;
import com.univibe.group.repo.GroupMessageRepository;
import com.univibe.reaction.dto.ReactionRequest;
import com.univibe.reaction.model.MessageContextType;
import com.univibe.reaction.service.MessageReactionService;
import com.univibe.social.model.PrivateMessage;
import com.univibe.social.repo.PrivateMessageRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageReactionController {

    private final MessageReactionService messageReactionService;
    private final ChatMessageRepository chatMessageRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final PrivateMessageRepository privateMessageRepository;
    private final MessageResponseMapper messageResponseMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    public MessageReactionController(MessageReactionService messageReactionService,
                                     ChatMessageRepository chatMessageRepository,
                                     GroupMessageRepository groupMessageRepository,
                                     PrivateMessageRepository privateMessageRepository,
                                     MessageResponseMapper messageResponseMapper,
                                     SimpMessagingTemplate messagingTemplate,
                                     ObjectMapper objectMapper,
                                     UserRepository userRepository) {
        this.messageReactionService = messageReactionService;
        this.chatMessageRepository = chatMessageRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.privateMessageRepository = privateMessageRepository;
        this.messageResponseMapper = messageResponseMapper;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
    }

    @PostMapping("/{contextType}/{messageId}/reactions")
    public Object toggleReaction(@PathVariable MessageContextType contextType,
                                 @PathVariable Long messageId,
                                 @RequestBody ReactionRequest request,
                                 Authentication authentication) throws JsonProcessingException {
        User user = resolveUser(authentication);
        messageReactionService.toggleReaction(contextType, messageId, request.emoji(), user);
        return broadcastUpdatedMessage(contextType, messageId);
    }

    private Object broadcastUpdatedMessage(MessageContextType contextType, Long messageId) throws JsonProcessingException {
        return switch (contextType) {
            case EVENT_CHAT -> {
                ChatMessage message = chatMessageRepository.findById(messageId).orElseThrow();
                var response = messageResponseMapper.toChatResponse(message);
                messagingTemplate.convertAndSend("/topic/events." + message.getEvent().getId(), objectMapper.writeValueAsString(response));
                yield response;
            }
            case GROUP_CHAT -> {
                GroupMessage message = groupMessageRepository.findById(messageId).orElseThrow();
                var response = messageResponseMapper.toGroupResponse(message);
                messagingTemplate.convertAndSend("/topic/groups." + message.getGroup().getId(), objectMapper.writeValueAsString(response));
                yield response;
            }
            case PRIVATE_CHAT -> {
                PrivateMessage message = privateMessageRepository.findById(messageId).orElseThrow();
                var response = messageResponseMapper.toPrivateResponse(message);
                messagingTemplate.convertAndSend("/queue/private." + message.getSender().getId(), objectMapper.writeValueAsString(response));
                messagingTemplate.convertAndSend("/queue/private." + message.getReceiver().getId(), objectMapper.writeValueAsString(response));
                yield response;
            }
        };
    }

    private User resolveUser(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return userRepository.findByEmail(email).orElseThrow();
    }
}























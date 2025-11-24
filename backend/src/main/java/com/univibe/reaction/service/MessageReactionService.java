package com.univibe.reaction.service;

import com.univibe.chat.model.ChatMessage;
import com.univibe.chat.repo.ChatMessageRepository;
import com.univibe.event.service.EventSecurityService;
import com.univibe.group.model.GroupMessage;
import com.univibe.group.repo.GroupMessageRepository;
import com.univibe.reaction.model.MessageContextType;
import com.univibe.reaction.model.MessageReaction;
import com.univibe.reaction.repo.MessageReactionRepository;
import com.univibe.social.model.PrivateMessage;
import com.univibe.social.repo.PrivateMessageRepository;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class MessageReactionService {

    private final MessageReactionRepository reactionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final PrivateMessageRepository privateMessageRepository;
    private final EventSecurityService eventSecurityService;

    public MessageReactionService(MessageReactionRepository reactionRepository,
                                  ChatMessageRepository chatMessageRepository,
                                  GroupMessageRepository groupMessageRepository,
                                  PrivateMessageRepository privateMessageRepository,
                                  EventSecurityService eventSecurityService) {
        this.reactionRepository = reactionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.privateMessageRepository = privateMessageRepository;
        this.eventSecurityService = eventSecurityService;
    }

    @Transactional
    public void toggleReaction(MessageContextType contextType, Long messageId, String emoji, User user) {
        validateEmoji(emoji);
        switch (contextType) {
            case EVENT_CHAT -> validateEventMessageAccess(messageId, user);
            case GROUP_CHAT -> validateGroupMessageAccess(messageId, user);
            case PRIVATE_CHAT -> validatePrivateMessageAccess(messageId, user);
        }

        var existing = reactionRepository.findByMessageTypeAndMessageIdAndUserIdAndEmoji(
                contextType,
                messageId,
                user.getId(),
                emoji
        );
        if (existing.isPresent()) {
            reactionRepository.delete(existing.get());
        } else {
            MessageReaction reaction = new MessageReaction();
            reaction.setMessageType(contextType);
            reaction.setMessageId(messageId);
            reaction.setEmoji(emoji);
            reaction.setUser(user);
            reactionRepository.save(reaction);
        }
    }

    private void validateEmoji(String emoji) {
        if (emoji == null || emoji.isBlank()) {
            throw new IllegalArgumentException("Emoji inválido");
        }
        if (emoji.codePointCount(0, emoji.length()) > 2) {
            throw new IllegalArgumentException("Usa emojis simples para reaccionar");
        }
    }

    private void validateEventMessageAccess(Long messageId, User user) {
        ChatMessage message = chatMessageRepository.findById(messageId).orElseThrow();
        if (!eventSecurityService.canAccessEvent(message.getEvent(), user)) {
            throw new org.springframework.security.access.AccessDeniedException("No puedes reaccionar en este evento");
        }
    }

    private void validateGroupMessageAccess(Long messageId, User user) {
        GroupMessage message = groupMessageRepository.findById(messageId).orElseThrow();
        boolean isOwner = message.getGroup().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER;
        boolean isMember = message.getGroup().getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()));
        if (!(isOwner || isAdmin || isMember)) {
            throw new org.springframework.security.access.AccessDeniedException("No perteneces a este grupo");
        }
    }

    private void validatePrivateMessageAccess(Long messageId, User user) {
        PrivateMessage message = privateMessageRepository.findById(messageId).orElseThrow();
        boolean isParticipant = message.getSender().getId().equals(user.getId()) || message.getReceiver().getId().equals(user.getId());
        if (!isParticipant) {
            throw new org.springframework.security.access.AccessDeniedException("No participas en esta conversación");
        }
    }
}























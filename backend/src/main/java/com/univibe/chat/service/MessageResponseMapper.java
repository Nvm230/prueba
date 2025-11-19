package com.univibe.chat.service;

import com.univibe.chat.dto.ChatMessageResponse;
import com.univibe.chat.dto.UserInfo;
import com.univibe.chat.model.ChatMessage;
import com.univibe.group.dto.GroupMessageResponse;
import com.univibe.group.model.GroupMessage;
import com.univibe.reaction.dto.MessageReactionDTO;
import com.univibe.reaction.model.MessageContextType;
import com.univibe.reaction.model.MessageReaction;
import com.univibe.reaction.repo.MessageReactionRepository;
import com.univibe.social.dto.PrivateMessageResponse;
import com.univibe.social.model.PrivateMessage;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class MessageResponseMapper {

    private final MessageReactionRepository reactionRepository;

    public MessageResponseMapper(MessageReactionRepository reactionRepository) {
        this.reactionRepository = reactionRepository;
    }

    public ChatMessageResponse toChatResponse(ChatMessage message) {
        UserInfo userInfo = new UserInfo(
                message.getUser().getId(),
                message.getUser().getName(),
                message.getUser().getEmail(),
                message.getUser().getProfilePictureUrl()
        );
        return new ChatMessageResponse(
                message.getId(),
                userInfo,
                message.getContent(),
                message.getFileUrl(),
                message.getFileType(),
                message.getFileName(),
                message.getCreatedAt(),
                message.getAttachment() != null ? message.getAttachment().getId() : null,
                message.getAttachment() != null ? message.getAttachment().getPreviewBase64() : null,
                message.getSticker() != null ? message.getSticker().getId() : null,
                message.getSticker() != null && message.getSticker().getFile() != null ? message.getSticker().getFile().getPreviewBase64() : null,
                buildReactions(MessageContextType.EVENT_CHAT, message.getId())
        );
    }

    public GroupMessageResponse toGroupResponse(GroupMessage message) {
        UserInfo senderInfo = new UserInfo(
                message.getSender().getId(),
                message.getSender().getName(),
                message.getSender().getEmail(),
                message.getSender().getProfilePictureUrl()
        );
        return new GroupMessageResponse(
                message.getId(),
                senderInfo,
                message.getContent(),
                message.getFileUrl(),
                message.getFileType(),
                message.getFileName(),
                message.getCreatedAt(),
                message.getAttachment() != null ? message.getAttachment().getId() : null,
                message.getAttachment() != null ? message.getAttachment().getPreviewBase64() : null,
                message.getSticker() != null ? message.getSticker().getId() : null,
                message.getSticker() != null && message.getSticker().getFile() != null ? message.getSticker().getFile().getPreviewBase64() : null,
                buildReactions(MessageContextType.GROUP_CHAT, message.getId())
        );
    }

    public PrivateMessageResponse toPrivateResponse(PrivateMessage message) {
        com.univibe.social.dto.UserInfo senderInfo = new com.univibe.social.dto.UserInfo(
                message.getSender().getId(),
                message.getSender().getName(),
                message.getSender().getEmail(),
                message.getSender().getProfilePictureUrl()
        );
        com.univibe.social.dto.UserInfo receiverInfo = new com.univibe.social.dto.UserInfo(
                message.getReceiver().getId(),
                message.getReceiver().getName(),
                message.getReceiver().getEmail(),
                message.getReceiver().getProfilePictureUrl()
        );
        return new PrivateMessageResponse(
                message.getId(),
                senderInfo,
                receiverInfo,
                message.getContent(),
                message.getFileUrl(),
                message.getFileType(),
                message.getFileName(),
                message.isReadFlag(),
                message.getCreatedAt(),
                message.getAttachment() != null ? message.getAttachment().getId() : null,
                message.getAttachment() != null ? message.getAttachment().getPreviewBase64() : null,
                message.getSticker() != null ? message.getSticker().getId() : null,
                message.getSticker() != null && message.getSticker().getFile() != null ? message.getSticker().getFile().getPreviewBase64() : null,
                message.getMode(),
                buildReactions(MessageContextType.PRIVATE_CHAT, message.getId())
        );
    }

    private List<MessageReactionDTO> buildReactions(MessageContextType type, Long messageId) {
        Map<String, List<Long>> grouped = reactionRepository.findByMessageTypeAndMessageId(type, messageId).stream()
                .collect(Collectors.groupingBy(
                        MessageReaction::getEmoji,
                        Collectors.mapping(r -> r.getUser().getId(), Collectors.toList())
                ));
        return grouped.entrySet().stream()
                .map(entry -> new MessageReactionDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingInt((MessageReactionDTO dto) -> dto.userIds().size()).reversed())
                .toList();
    }
}


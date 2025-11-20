package com.univibe.reaction.repo;

import com.univibe.reaction.model.MessageContextType;
import com.univibe.reaction.model.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {
    List<MessageReaction> findByMessageTypeAndMessageId(MessageContextType messageType, Long messageId);

    Optional<MessageReaction> findByMessageTypeAndMessageIdAndUserIdAndEmoji(
            MessageContextType messageType,
            Long messageId,
            Long userId,
            String emoji
    );
}























package com.univibe.gamification.event;

import com.univibe.user.model.User;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user sends a message
 */
public class MessageSentEvent extends ApplicationEvent {
    private final User user;
    private final Long messageId;
    
    public MessageSentEvent(Object source, User user, Long messageId) {
        super(source);
        this.user = user;
        this.messageId = messageId;
    }
    
    public User getUser() {
        return user;
    }
    
    public Long getMessageId() {
        return messageId;
    }
}

package com.univibe.gamification.event;

import com.univibe.user.model.User;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user creates a group
 */
public class GroupCreatedEvent extends ApplicationEvent {
    private final User user;
    private final Long groupId;
    
    public GroupCreatedEvent(Object source, User user, Long groupId) {
        super(source);
        this.user = user;
        this.groupId = groupId;
    }
    
    public User getUser() {
        return user;
    }
    
    public Long getGroupId() {
        return groupId;
    }
}

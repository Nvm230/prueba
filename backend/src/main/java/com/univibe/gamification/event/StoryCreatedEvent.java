package com.univibe.gamification.event;

import com.univibe.user.model.User;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user creates a story
 */
public class StoryCreatedEvent extends ApplicationEvent {
    private final User user;
    private final Long storyId;
    
    public StoryCreatedEvent(Object source, User user, Long storyId) {
        super(source);
        this.user = user;
        this.storyId = storyId;
    }
    
    public User getUser() {
        return user;
    }
    
    public Long getStoryId() {
        return storyId;
    }
}

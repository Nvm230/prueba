package com.univibe.gamification.event;

import com.univibe.user.model.User;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user updates their profile
 */
public class ProfileUpdatedEvent extends ApplicationEvent {
    private final User user;
    private final boolean hasPhoto;
    private final boolean isComplete;
    
    public ProfileUpdatedEvent(Object source, User user, boolean hasPhoto, boolean isComplete) {
        super(source);
        this.user = user;
        this.hasPhoto = hasPhoto;
        this.isComplete = isComplete;
    }
    
    public User getUser() {
        return user;
    }
    
    public boolean hasPhoto() {
        return hasPhoto;
    }
    
    public boolean isComplete() {
        return isComplete;
    }
}

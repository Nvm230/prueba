package com.univibe.gamification.event;

import com.univibe.user.model.User;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user registers for an event
 */
public class EventRegistrationEvent extends ApplicationEvent {
    private final User user;
    private final Long eventId;
    private final boolean isOnTime;
    
    public EventRegistrationEvent(Object source, User user, Long eventId, boolean isOnTime) {
        super(source);
        this.user = user;
        this.eventId = eventId;
        this.isOnTime = isOnTime;
    }
    
    public User getUser() {
        return user;
    }
    
    public Long getEventId() {
        return eventId;
    }
    
    public boolean isOnTime() {
        return isOnTime;
    }
}

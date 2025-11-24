package com.univibe.gamification.event;

import com.univibe.user.model.User;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user adds a friend
 */
public class FriendAddedEvent extends ApplicationEvent {
    private final User user;
    private final User friend;
    
    public FriendAddedEvent(Object source, User user, User friend) {
        super(source);
        this.user = user;
        this.friend = friend;
    }
    
    public User getUser() {
        return user;
    }
    
    public User getFriend() {
        return friend;
    }
}

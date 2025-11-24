package com.univibe.gamification.event;

import com.univibe.user.model.User;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user creates a post
 */
public class PostCreatedEvent extends ApplicationEvent {
    private final User user;
    private final Long postId;
    private final boolean hasImage;
    private final boolean hasMusic;
    
    public PostCreatedEvent(Object source, User user, Long postId, boolean hasImage, boolean hasMusic) {
        super(source);
        this.user = user;
        this.postId = postId;
        this.hasImage = hasImage;
        this.hasMusic = hasMusic;
    }
    
    public User getUser() {
        return user;
    }
    
    public Long getPostId() {
        return postId;
    }
    
    public boolean hasImage() {
        return hasImage;
    }
    
    public boolean hasMusic() {
        return hasMusic;
    }
}

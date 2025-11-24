package com.univibe.gamification.event;

import com.univibe.user.model.User;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user receives a like on their post
 */
public class LikeReceivedEvent extends ApplicationEvent {
    private final User postOwner;
    private final Long postId;
    private final int totalLikes;
    
    public LikeReceivedEvent(Object source, User postOwner, Long postId, int totalLikes) {
        super(source);
        this.postOwner = postOwner;
        this.postId = postId;
        this.totalLikes = totalLikes;
    }
    
    public User getPostOwner() {
        return postOwner;
    }
    
    public Long getPostId() {
        return postId;
    }
    
    public int getTotalLikes() {
        return totalLikes;
    }
}

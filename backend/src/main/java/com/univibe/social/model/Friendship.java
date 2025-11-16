package com.univibe.social.model;

import com.univibe.user.model.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "friendships", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user1_id", "user2_id"})
})
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user1_id")
    private User user1;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user2_id")
    private User user2;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser1() { return user1; }
    public void setUser1(User user1) { this.user1 = user1; }
    public User getUser2() { return user2; }
    public void setUser2(User user2) { this.user2 = user2; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}








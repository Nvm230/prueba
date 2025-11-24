package com.univibe.call.model;

import com.univibe.user.model.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "call_sessions")
public class CallSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CallContextType contextType;

    @Column(nullable = false)
    private Long contextId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CallMode mode = CallMode.NORMAL;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User createdBy;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "accepted_at")
    private Instant acceptedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "missed", nullable = false)
    private boolean missed = false;

    public Long getId() {
        return id;
    }

    public CallContextType getContextType() {
        return contextType;
    }

    public void setContextType(CallContextType contextType) {
        this.contextType = contextType;
    }

    public Long getContextId() {
        return contextId;
    }

    public void setContextId(Long contextId) {
        this.contextId = contextId;
    }

    public CallMode getMode() {
        return mode;
    }

    public void setMode(CallMode mode) {
        this.mode = mode;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getAcceptedAt() {
        return acceptedAt;
    }

    public void setAcceptedAt(Instant acceptedAt) {
        this.acceptedAt = acceptedAt;
    }

    public Instant getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(Instant endedAt) {
        this.endedAt = endedAt;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public boolean isMissed() {
        return missed;
    }

    public void setMissed(boolean missed) {
        this.missed = missed;
    }
}


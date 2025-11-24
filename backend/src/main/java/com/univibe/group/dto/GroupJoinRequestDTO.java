package com.univibe.group.dto;

import com.univibe.event.dto.UserSummaryDTO;
import com.univibe.group.model.GroupJoinRequest;
import com.univibe.group.model.GroupJoinRequestStatus;

import java.time.Instant;

public class GroupJoinRequestDTO {
    private Long id;
    private UserSummaryDTO user;
    private GroupJoinRequestStatus status;
    private Instant createdAt;

    public GroupJoinRequestDTO() {}

    public GroupJoinRequestDTO(GroupJoinRequest request) {
        this.id = request.getId();
        this.status = request.getStatus();
        this.createdAt = request.getCreatedAt();
        var user = request.getUser();
        if (user != null) {
            this.user = new UserSummaryDTO(user.getId(), user.getName(), user.getEmail(), user.getProfilePictureUrl());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserSummaryDTO getUser() { return user; }
    public void setUser(UserSummaryDTO user) { this.user = user; }
    public GroupJoinRequestStatus getStatus() { return status; }
    public void setStatus(GroupJoinRequestStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}


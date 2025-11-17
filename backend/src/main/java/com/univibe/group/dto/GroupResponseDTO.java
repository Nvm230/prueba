package com.univibe.group.dto;

import com.univibe.event.dto.UserSummaryDTO;
import com.univibe.group.model.Group;
import com.univibe.group.model.GroupPrivacy;
import com.univibe.user.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class GroupResponseDTO {
    private Long id;
    private String name;
    private GroupPrivacy privacy;
    private UserSummaryDTO owner;
    private List<UserSummaryDTO> members;
    private Boolean pendingJoinRequest;
    private Boolean membersCanChat;

    public GroupResponseDTO() {}

    public GroupResponseDTO(Group group) {
        this.id = group.getId();
        this.name = group.getName();
        this.privacy = group.getPrivacy();
        User owner = group.getOwner();
        this.owner = owner != null ? new UserSummaryDTO(owner.getId(), owner.getName(), owner.getEmail(), owner.getProfilePictureUrl()) : null;
        this.members = group.getMembers().stream()
                .map(member -> new UserSummaryDTO(member.getId(), member.getName(), member.getEmail(), member.getProfilePictureUrl()))
                .collect(Collectors.toList());
        // Manejar null por si la migración no se ha ejecutado o hay grupos antiguos
        this.membersCanChat = group.getMembersCanChat() != null ? group.getMembersCanChat() : false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public GroupPrivacy getPrivacy() { return privacy; }
    public void setPrivacy(GroupPrivacy privacy) { this.privacy = privacy; }
    public UserSummaryDTO getOwner() { return owner; }
    public void setOwner(UserSummaryDTO owner) { this.owner = owner; }
    public List<UserSummaryDTO> getMembers() { return members; }
    public void setMembers(List<UserSummaryDTO> members) { this.members = members; }
    public Boolean getPendingJoinRequest() { return pendingJoinRequest; }
    public void setPendingJoinRequest(Boolean pendingJoinRequest) { this.pendingJoinRequest = pendingJoinRequest; }
    public Boolean getMembersCanChat() { return membersCanChat; }
    public void setMembersCanChat(Boolean membersCanChat) { this.membersCanChat = membersCanChat; }
}


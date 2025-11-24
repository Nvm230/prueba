package com.univibe.group.model;

import com.univibe.user.model.User;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne(optional = false)
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupPrivacy privacy = GroupPrivacy.PUBLIC;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "group_members",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> members = new HashSet<>();

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean membersCanChat = false; // Por defecto solo owner/admin puede enviar mensajes

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public GroupPrivacy getPrivacy() { return privacy; }
    public void setPrivacy(GroupPrivacy privacy) { this.privacy = privacy; }
    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> members) { this.members = members; }
    public Boolean getMembersCanChat() { return membersCanChat; }
    public void setMembersCanChat(Boolean membersCanChat) { this.membersCanChat = membersCanChat; }
}

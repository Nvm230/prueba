package com.univibe.social.dto;

public class UserInfo {
    private Long id;
    private String name;
    private String email;
    private String profilePictureUrl;

    public UserInfo(Long id, String name, String email, String profilePictureUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profilePictureUrl = profilePictureUrl;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
}








package com.univibe.social.dto;

public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private int points;
    private String qrCodeBase64;
    private String profilePictureUrl;

    public UserProfileResponse(Long id, String name, String email, int points, String qrCodeBase64, String profilePictureUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.points = points;
        this.qrCodeBase64 = qrCodeBase64;
        this.profilePictureUrl = profilePictureUrl;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getPoints() { return points; }
    public String getQrCodeBase64() { return qrCodeBase64; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
}








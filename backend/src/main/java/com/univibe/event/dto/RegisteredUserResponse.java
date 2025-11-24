package com.univibe.event.dto;

public class RegisteredUserResponse {
    private Long id;
    private String name;
    private String email; // Solo para admin/server
    private String status;
    private java.time.Instant checkedInAt;

    public RegisteredUserResponse() {}

    public RegisteredUserResponse(Long id, String name, String email, String status, java.time.Instant checkedInAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.status = status;
        this.checkedInAt = checkedInAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public java.time.Instant getCheckedInAt() { return checkedInAt; }
    public void setCheckedInAt(java.time.Instant checkedInAt) { this.checkedInAt = checkedInAt; }
}


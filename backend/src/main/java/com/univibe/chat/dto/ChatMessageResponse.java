package com.univibe.chat.dto;

import java.time.Instant;

public class ChatMessageResponse {
    private Long id;
    private UserInfo user;
    private String content;
    private String fileUrl;
    private String fileType;
    private String fileName;
    private Instant createdAt;

    public ChatMessageResponse(Long id, UserInfo user, String content, String fileUrl, String fileType, String fileName, Instant createdAt) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileName = fileName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public UserInfo getUser() { return user; }
    public String getContent() { return content; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
    public String getFileName() { return fileName; }
    public Instant getCreatedAt() { return createdAt; }
}


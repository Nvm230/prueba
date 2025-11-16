package com.univibe.group.dto;

import com.univibe.chat.dto.UserInfo;
import java.time.Instant;

public class GroupMessageResponse {
    private Long id;
    private UserInfo sender;
    private String content;
    private String fileUrl;
    private String fileType;
    private String fileName;
    private Instant createdAt;

    public GroupMessageResponse(Long id, UserInfo sender, String content, String fileUrl, String fileType, String fileName, Instant createdAt) {
        this.id = id;
        this.sender = sender;
        this.content = content;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileName = fileName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public UserInfo getSender() { return sender; }
    public String getContent() { return content; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
    public String getFileName() { return fileName; }
    public Instant getCreatedAt() { return createdAt; }
}








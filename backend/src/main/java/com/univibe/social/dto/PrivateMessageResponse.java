package com.univibe.social.dto;

import com.univibe.social.dto.UserInfo;
import java.time.Instant;

public class PrivateMessageResponse {
    private Long id;
    private UserInfo sender;
    private UserInfo receiver;
    private String content;
    private String fileUrl;
    private String fileType;
    private String fileName;
    private boolean readFlag;
    private Instant createdAt;

    public PrivateMessageResponse(Long id, UserInfo sender, UserInfo receiver, String content, String fileUrl, String fileType, String fileName, boolean readFlag, Instant createdAt) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileName = fileName;
        this.readFlag = readFlag;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public UserInfo getSender() { return sender; }
    public UserInfo getReceiver() { return receiver; }
    public String getContent() { return content; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
    public String getFileName() { return fileName; }
    public boolean isReadFlag() { return readFlag; }
    public Instant getCreatedAt() { return createdAt; }
}








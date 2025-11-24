package com.univibe.social.dto;

public class PrivateMessageRequest {
    private String content;
    private String fileUrl;
    private String fileType;
    private String fileName;
    private Long fileId;
    private Long stickerId;
    private String callMode;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public Long getFileId() { return fileId; }
    public void setFileId(Long fileId) { this.fileId = fileId; }
    public Long getStickerId() { return stickerId; }
    public void setStickerId(Long stickerId) { this.stickerId = stickerId; }
    public String getCallMode() { return callMode; }
    public void setCallMode(String callMode) { this.callMode = callMode; }
}








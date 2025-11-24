package com.univibe.group.dto;

import com.univibe.chat.dto.UserInfo;
import java.time.Instant;
import java.util.List;

import com.univibe.reaction.dto.MessageReactionDTO;

public class GroupMessageResponse {
    private Long id;
    private UserInfo sender;
    private String content;
    private String fileUrl;
    private String fileType;
    private String fileName;
    private Instant createdAt;
    private Long fileId;
    private String filePreview;
    private Long stickerId;
    private String stickerPreview;
    private List<MessageReactionDTO> reactions;

    public GroupMessageResponse(Long id,
                                UserInfo sender,
                                String content,
                                String fileUrl,
                                String fileType,
                                String fileName,
                                Instant createdAt,
                                Long fileId,
                                String filePreview,
                                Long stickerId,
                                String stickerPreview,
                                List<MessageReactionDTO> reactions) {
        this.id = id;
        this.sender = sender;
        this.content = content;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileName = fileName;
        this.createdAt = createdAt;
        this.fileId = fileId;
        this.filePreview = filePreview;
        this.stickerId = stickerId;
        this.stickerPreview = stickerPreview;
        this.reactions = reactions;
    }

    public Long getId() { return id; }
    public UserInfo getSender() { return sender; }
    public String getContent() { return content; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
    public String getFileName() { return fileName; }
    public Instant getCreatedAt() { return createdAt; }
    public Long getFileId() { return fileId; }
    public String getFilePreview() { return filePreview; }
    public Long getStickerId() { return stickerId; }
    public String getStickerPreview() { return stickerPreview; }
    public List<MessageReactionDTO> getReactions() { return reactions; }
}








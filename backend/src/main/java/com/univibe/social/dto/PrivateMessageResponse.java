package com.univibe.social.dto;

import com.univibe.social.dto.UserInfo;
import java.time.Instant;
import java.util.List;

import com.univibe.reaction.dto.MessageReactionDTO;

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
    private Long fileId;
    private String filePreview;
    private Long stickerId;
    private String stickerPreview;
    private String callMode;
    private List<MessageReactionDTO> reactions;

    public PrivateMessageResponse(Long id,
                                  UserInfo sender,
                                  UserInfo receiver,
                                  String content,
                                  String fileUrl,
                                  String fileType,
                                  String fileName,
                                  boolean readFlag,
                                  Instant createdAt,
                                  Long fileId,
                                  String filePreview,
                                  Long stickerId,
                                  String stickerPreview,
                                  String callMode,
                                  List<MessageReactionDTO> reactions) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileName = fileName;
        this.readFlag = readFlag;
        this.createdAt = createdAt;
        this.fileId = fileId;
        this.filePreview = filePreview;
        this.stickerId = stickerId;
        this.stickerPreview = stickerPreview;
        this.callMode = callMode;
        this.reactions = reactions;
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
    public Long getFileId() { return fileId; }
    public String getFilePreview() { return filePreview; }
    public Long getStickerId() { return stickerId; }
    public String getStickerPreview() { return stickerPreview; }
    public String getCallMode() { return callMode; }
    public List<MessageReactionDTO> getReactions() { return reactions; }
}








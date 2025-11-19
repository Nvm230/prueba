package com.univibe.social.model;

import com.univibe.media.model.StoredFile;
import com.univibe.sticker.model.Sticker;
import com.univibe.user.model.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "private_messages")
public class PrivateMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne(optional = false)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    @Column(length = 50)
    private String fileType;

    @Column(length = 255)
    private String fileName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_asset_id")
    private StoredFile attachment;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sticker sticker;

    @Column(length = 30)
    private String mode;

    @Column(nullable = false)
    private boolean readFlag = false;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public StoredFile getAttachment() { return attachment; }
    public void setAttachment(StoredFile attachment) { this.attachment = attachment; }
    public Sticker getSticker() { return sticker; }
    public void setSticker(Sticker sticker) { this.sticker = sticker; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public boolean isReadFlag() { return readFlag; }
    public void setReadFlag(boolean readFlag) { this.readFlag = readFlag; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}








package com.univibe.chat.model;

import com.univibe.event.model.Event;
import com.univibe.media.model.StoredFile;
import com.univibe.sticker.model.Sticker;
import com.univibe.user.model.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Event event;

    @ManyToOne(optional = false)
    private User user;

    @Column(nullable = false, length = 2000)
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

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}


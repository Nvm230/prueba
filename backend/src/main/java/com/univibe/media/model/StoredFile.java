package com.univibe.media.model;

import com.univibe.user.model.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "file_assets")
public class StoredFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User uploader;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false, length = 120)
    private String contentType;

    @Column(nullable = false)
    private Long sizeInBytes;

    @Enumerated(EnumType.STRING)
    private FileScope scope;

    private Long scopeId;

    @Column(nullable = false)
    private boolean sticker = false;

    @Column(nullable = false, columnDefinition = "bytea")
    private byte[] data;

    @Column(columnDefinition = "text")
    private String previewBase64;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() {
        return id;
    }

    public User getUploader() {
        return uploader;
    }

    public void setUploader(User uploader) {
        this.uploader = uploader;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getSizeInBytes() {
        return sizeInBytes;
    }

    public void setSizeInBytes(Long sizeInBytes) {
        this.sizeInBytes = sizeInBytes;
    }

    public FileScope getScope() {
        return scope;
    }

    public void setScope(FileScope scope) {
        this.scope = scope;
    }

    public Long getScopeId() {
        return scopeId;
    }

    public void setScopeId(Long scopeId) {
        this.scopeId = scopeId;
    }

    public boolean isSticker() {
        return sticker;
    }

    public void setSticker(boolean sticker) {
        this.sticker = sticker;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getPreviewBase64() {
        return previewBase64;
    }

    public void setPreviewBase64(String previewBase64) {
        this.previewBase64 = previewBase64;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}


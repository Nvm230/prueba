package com.univibe.sticker.model;

import com.univibe.media.model.StoredFile;
import com.univibe.user.model.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "stickers")
public class Sticker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "file_asset_id")
    private StoredFile file;

    @Column(name = "nombre", length = 80)
    private String nombre;

    @Column(name = "global_flag", nullable = false)
    private boolean globalFlag = false;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() {
        return id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public StoredFile getFile() {
        return file;
    }

    public void setFile(StoredFile file) {
        this.file = file;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public boolean isGlobalFlag() {
        return globalFlag;
    }

    public void setGlobalFlag(boolean globalFlag) {
        this.globalFlag = globalFlag;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

















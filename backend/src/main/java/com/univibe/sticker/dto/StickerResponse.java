package com.univibe.sticker.dto;

public record StickerResponse(
        Long id,
        String nombre,
        boolean global,
        boolean owned,
        String contentType,
        String previewBase64,
        Long fileId
) {}


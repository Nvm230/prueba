package com.univibe.media.dto;

public record FileUploadResponse(
        Long id,
        String fileName,
        String contentType,
        Long sizeInBytes,
        String previewBase64
) {}

















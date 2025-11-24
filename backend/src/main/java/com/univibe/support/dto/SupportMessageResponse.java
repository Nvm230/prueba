package com.univibe.support.dto;

import java.time.Instant;

public record SupportMessageResponse(
        Long id,
        SupportUserInfo sender,
        String contenido,
        Instant createdAt
) {}

















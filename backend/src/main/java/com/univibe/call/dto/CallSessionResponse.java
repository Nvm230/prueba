package com.univibe.call.dto;

import com.univibe.call.model.CallContextType;
import com.univibe.call.model.CallMode;

import java.time.Instant;

public record CallSessionResponse(
        Long id,
        CallContextType contextType,
        Long contextId,
        CallMode mode,
        boolean activo,
        Instant createdAt,
        Instant acceptedAt,
        Instant endedAt,
        Integer durationSeconds,
        boolean missed,
        Long createdById
) {}


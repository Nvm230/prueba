package com.univibe.support.dto;

import com.univibe.support.model.SupportTicketStatus;

import java.time.Instant;
import java.util.List;

public record SupportTicketResponse(
        Long id,
        String asunto,
        String categoria,
        SupportTicketStatus estado,
        Instant createdAt,
        Instant updatedAt,
        SupportUserInfo solicitante,
        List<SupportMessageResponse> mensajes
) {}

















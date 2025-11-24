package com.univibe.reaction.dto;

import java.util.List;

public record MessageReactionDTO(
        String emoji,
        List<Long> userIds
) {}
















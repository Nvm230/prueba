package com.univibe.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record UpdateProfileRequest(
        @NotBlank String name,
        @NotNull Set<String> preferredCategories,
        String profilePictureUrl
) {}

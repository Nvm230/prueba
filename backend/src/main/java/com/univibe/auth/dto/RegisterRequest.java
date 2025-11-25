package com.univibe.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
        @NotBlank
        @Pattern(regexp = "^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü' .-]{2,100}$", message = "El nombre debe tener entre 2 y 100 caracteres")
        String name,
        @Email String email,
        @NotBlank String password
) {}

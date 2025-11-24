package com.univibe.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
        @NotBlank
        @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]{3,100}$", message = "El nombre debe contener solo letras y espacios")
        String name,
        @Email String email,
        @NotBlank String password
) {}

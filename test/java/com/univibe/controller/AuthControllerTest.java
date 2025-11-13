package com.univibe.controller;

import com.univibe.auth.AuthController;
import com.univibe.auth.dto.AuthResponse;
import com.univibe.auth.dto.LoginRequest;
import com.univibe.auth.dto.RegisterRequest;
import com.univibe.common.exception.DuplicateResourceException;
import com.univibe.common.exception.UnauthorizedException;
import com.univibe.security.JwtService;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock private UserRepository userRepository;
    @Mock private JwtService jwtService;
    @Mock private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @InjectMocks private AuthController authController;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest("Test", "test@univibe.com", "123");
        when(userRepository.existsByEmail(req.email())).thenReturn(false);
        when(passwordEncoder.encode(req.password())).thenReturn("encoded");
        when(jwtService.generateToken(anyString(), anyMap())).thenReturn("token");

        AuthResponse res = authController.register(req);

        assertNotNull(res.token());
    }

    @Test
    void testLoginInvalidCredentials() {
        LoginRequest req = new LoginRequest("test@univibe.com", "123");
        when(userRepository.findByEmail(req.email())).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authController.login(req));
    }
}

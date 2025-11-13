package com.univibe.service;

import com.univibe.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "c2VjcmV0c2VjcmV0c2VjcmV0c2VjcmV0c2VjcmV0c2VjcmV0c2VjcmV0c2VjcmV0c2VjcmV0c2U=",
                3600
        );
    }

    @Test
    void testGenerateAndParseToken() {
        String token = jwtService.generateToken("user@test.com", Map.of("role", "USER"));
        assertNotNull(token);

        Jws<Claims> parsed = jwtService.parse(token);
        assertEquals("user@test.com", parsed.getBody().getSubject());
        assertEquals("USER", parsed.getBody().get("role"));
    }

    @Test
    void testTokenExpirationIsSet() {
        String token = jwtService.generateToken("subject", Map.of());
        Jws<Claims> parsed = jwtService.parse(token);

        assertTrue(parsed.getBody().getExpiration().after(parsed.getBody().getIssuedAt()));
    }
}

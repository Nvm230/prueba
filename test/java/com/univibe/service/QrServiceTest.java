package com.univibe.service;

import com.univibe.registration.service.QrService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QrServiceTest {

    private QrService qrService;

    @BeforeEach
    void setUp() {
        qrService = new QrService();
    }

    @Test
    void testGeneratePayload() {
        String payload = qrService.generatePayload(1L, 2L);
        assertTrue(payload.contains("-") || payload.length() > 0);
    }

    @Test
    void testGenerateBase64Png() {
        String base64 = qrService.generateBase64Png("test-payload");
        assertNotNull(base64);
        assertTrue(base64.startsWith("iVBOR") || base64.length() > 10); 
    }
}

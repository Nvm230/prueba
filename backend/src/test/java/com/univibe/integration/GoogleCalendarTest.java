package com.univibe.integration;

import com.univibe.integration.googlecalendar.GoogleCalendarController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "GOOGLE_CALENDAR_ACCESS_TOKEN=test-token",
    "GOOGLE_CALENDAR_ID=primary"
})
public class GoogleCalendarTest {

    @Autowired(required = false)
    private GoogleCalendarController googleCalendarController;

    @Test
    public void testGoogleCalendarControllerExists() {
        assertNotNull(googleCalendarController, "GoogleCalendarController debe estar configurado");
    }

    @Test
    public void testGoogleCalendarConfiguration() {
        // Verificar que el controlador puede ser instanciado
        assertNotNull(googleCalendarController);
    }
}


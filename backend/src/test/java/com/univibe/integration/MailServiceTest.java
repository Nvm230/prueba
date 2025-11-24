package com.univibe.integration;

import com.univibe.notification.service.MailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "MAIL_HOST=smtp.gmail.com",
    "MAIL_PORT=587",
    "MAIL_USERNAME=test@example.com",
    "MAIL_PASSWORD=test-password",
    "MAIL_SMTP_AUTH=true",
    "MAIL_SMTP_STARTTLS_ENABLE=true"
})
public class MailServiceTest {

    @Autowired(required = false)
    private MailService mailService;

    @Test
    public void testMailServiceExists() {
        assertNotNull(mailService, "MailService debe estar configurado");
    }

    @Test
    public void testMailConfiguration() {
        // Verificar que el servicio puede ser instanciado con la configuración
        assertNotNull(mailService);
    }
}


package com.univibe.notification.listener;

import com.univibe.common.event.RegistrationCreatedEvent;
import com.univibe.notification.service.MailService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class RegistrationEmailListener {
    private final MailService mailService;
    public RegistrationEmailListener(MailService mailService) { this.mailService = mailService; }

    @EventListener
    public void onRegistration(RegistrationCreatedEvent event) {
        String subject = "✅ Registro confirmado: " + event.getEventTitle();
        String htmlContent = mailService.createEventRegistrationEmail(
            event.getEventTitle(), 
            event.getEventStartTime().toString(),
            "Estudiante" // Podemos mejorar esto con el nombre real del usuario
        );
        mailService.sendHtmlEmail(event.getUserEmail(), subject, htmlContent);
    }
}

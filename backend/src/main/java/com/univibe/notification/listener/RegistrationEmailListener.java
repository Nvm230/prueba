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
        String subject = "Registro confirmado: " + event.getEventTitle();
        String body = "Te registraste al evento '" + event.getEventTitle() + "'" +
                " que inicia el " + event.getEventStartTime() + ".";
        mailService.send(event.getUserEmail(), subject, body);
    }
}

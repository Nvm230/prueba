package com.univibe.registration.web;

import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import com.univibe.gamification.service.GamificationService;
import com.univibe.registration.model.Registration;
import com.univibe.registration.model.RegistrationStatus;
import com.univibe.registration.repo.RegistrationRepository;
import com.univibe.registration.service.QrService;
import com.univibe.registration.dto.RegistrationResponse;
import com.univibe.registration.dto.CheckInRequest;
import com.univibe.registration.dto.CheckInResponse;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import jakarta.validation.constraints.NotNull;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final QrService qrService;
    private final ApplicationEventPublisher eventPublisher;
    private final GamificationService gamificationService;

    public RegistrationController(RegistrationRepository registrationRepository, UserRepository userRepository, EventRepository eventRepository, QrService qrService, ApplicationEventPublisher eventPublisher, GamificationService gamificationService) {
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.qrService = qrService;
        this.eventPublisher = eventPublisher;
        this.gamificationService = gamificationService;
    }

    @PostMapping(value = "/{eventId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public RegistrationResponse register(Authentication auth, @PathVariable Long eventId) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        // No permitir registro a eventos finalizados
        if (event.getStatus() == com.univibe.event.model.EventStatus.FINISHED) {
            throw new IllegalStateException("Cannot register to finished events");
        }

        registrationRepository.findByUserIdAndEventId(user.getId(), eventId).ifPresent(r -> { throw new IllegalStateException("Already registered"); });

        String payload = qrService.generatePayload(user.getId(), eventId);
        String qrBase64 = qrService.generateBase64Png(payload);

        Registration r = new Registration();
        r.setUser(user);
        r.setEvent(event);
        r.setQrCode(payload);
        registrationRepository.save(r);
        eventPublisher.publishEvent(new com.univibe.common.event.RegistrationCreatedEvent(user.getEmail(), event.getTitle(), event.getStartTime()));

        return new RegistrationResponse(r.getId(), qrBase64);
    }

    @PostMapping("/check-in")
    public CheckInResponse checkIn(@RequestBody CheckInRequest body) {
        String payload = body.getPayload();
        String decoded = new String(java.util.Base64.getUrlDecoder().decode(payload));
        String[] parts = decoded.split(":");
        Long userId = Long.parseLong(parts[0]);
        Long eventId = Long.parseLong(parts[1]);

        Registration r = registrationRepository.findByUserIdAndEventId(userId, eventId).orElseThrow();
        if (r.getStatus() == RegistrationStatus.CHECKED_IN) {
            throw new IllegalStateException("Already checked in");
        }
        r.setStatus(RegistrationStatus.CHECKED_IN);
        r.setCheckedInAt(Instant.now());
        registrationRepository.save(r);
        
        // Otorgar 1 punto por asistir al evento
        gamificationService.addPoints(userId, 1);
        
        return new CheckInResponse(r.getStatus(), r.getCheckedInAt());
    }
}

package com.univibe.registration.web;

import com.univibe.event.model.Event;
import com.univibe.event.service.EventSecurityService;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final QrService qrService;
    private final ApplicationEventPublisher eventPublisher;
    private final GamificationService gamificationService;
    private final EventSecurityService eventSecurityService;

    public RegistrationController(RegistrationRepository registrationRepository, UserRepository userRepository, EventRepository eventRepository, QrService qrService, ApplicationEventPublisher eventPublisher, GamificationService gamificationService, EventSecurityService eventSecurityService) {
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.qrService = qrService;
        this.eventPublisher = eventPublisher;
        this.gamificationService = gamificationService;
        this.eventSecurityService = eventSecurityService;
    }

    private void ensureUserCanAccess(Event event, User user) {
        if (!eventSecurityService.canAccessEvent(event, user)) {
            throw new AccessDeniedException("Este evento es privado. Únete al grupo correspondiente para registrarte.");
        }
    }

    @GetMapping(value = "/events/{eventId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getRegistration(Authentication auth, @PathVariable Long eventId) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        Optional<Registration> registration = registrationRepository.findByUserIdAndEventId(user.getId(), eventId);
        
        if (registration.isPresent()) {
            Registration r = registration.get();
            String qrBase64 = qrService.generateBase64Png(r.getQrCode());
            return ResponseEntity.ok(new RegistrationResponse(
                r.getId(),
                qrBase64,
                r.getStatus().name(),
                r.getCheckedInAt()
            ));
        } else {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Not registered"));
        }
    }

    @PostMapping("/scan")
    public RegistrationResponse scanEventQr(@RequestBody Map<String, String> body, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        String qrPayload = body.get("qrPayload");
        if (qrPayload == null || qrPayload.trim().isEmpty()) {
            throw new IllegalArgumentException("QR payload requerido");
        }
        
        // Decodificar el QR del evento
        String decoded = new String(java.util.Base64.getUrlDecoder().decode(qrPayload));
        if (!decoded.startsWith("REGISTER:")) {
            throw new IllegalArgumentException("QR inválido. Debe ser un código de registro de evento.");
        }
        
        Long eventId = Long.parseLong(decoded.substring("REGISTER:".length()));
        Event event = eventRepository.findById(eventId).orElseThrow();
        ensureUserCanAccess(event, user);
        
        // No permitir registro a eventos finalizados
        if (event.getStatus() == com.univibe.event.model.EventStatus.FINISHED) {
            throw new IllegalStateException("No se puede registrar a eventos finalizados");
        }
        
        // Verificar si ya está registrado
        Optional<Registration> existing = registrationRepository.findByUserIdAndEventId(user.getId(), eventId);
        if (existing.isPresent()) {
            Registration r = existing.get();
            String qrBase64 = qrService.generateBase64Png(r.getQrCode());
            return new RegistrationResponse(r.getId(), qrBase64, r.getStatus().name(), r.getCheckedInAt());
        }
        
        // Registrar al usuario
        String userPayload = qrService.generatePayload(user.getId(), eventId);
        String qrBase64 = qrService.generateBase64Png(userPayload);
        
        Registration r = new Registration();
        r.setUser(user);
        r.setEvent(event);
        r.setQrCode(userPayload);
        registrationRepository.save(r);
        eventPublisher.publishEvent(new com.univibe.common.event.RegistrationCreatedEvent(user.getEmail(), event.getTitle(), event.getStartTime()));
        
        return new RegistrationResponse(r.getId(), qrBase64, r.getStatus().name(), r.getCheckedInAt());
    }

    @PostMapping(value = "/events/{eventId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public RegistrationResponse register(Authentication auth, @PathVariable Long eventId) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();
        ensureUserCanAccess(event, user);

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

        return new RegistrationResponse(r.getId(), qrBase64, r.getStatus().name(), r.getCheckedInAt());
    }

    @GetMapping("/events/{eventId}/qr")
    public ResponseEntity<?> getEventRegistrationQr(@PathVariable Long eventId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();
        ensureUserCanAccess(event, user);

        if (event.getStatus() == com.univibe.event.model.EventStatus.FINISHED) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "No se puede registrar a eventos finalizados"));
        }

        String payload = qrService.generateEventRegistrationPayload(eventId);
        String qrBase64 = qrService.generateBase64Png(payload);

        return ResponseEntity.ok(Map.of(
            "eventId", eventId,
            "qrBase64", qrBase64,
            "payload", payload
        ));
    }

    @PostMapping("/check-in")
    public CheckInResponse checkIn(@RequestBody CheckInRequest body, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long userId = user.getId();
        Long eventId;
        Registration r;

        // Verificar si es check-in con QR o con contraseña
        if (body.getPayload() != null && !body.getPayload().trim().isEmpty()) {
            // Check-in con QR (método original)
            String payload = body.getPayload().trim();
            String decoded;
            try {
                decoded = new String(java.util.Base64.getUrlDecoder().decode(payload));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("El código QR es inválido o está incompleto.");
            }

            if (decoded.startsWith("REGISTER:")) {
                throw new IllegalArgumentException("Este QR es solo para registrarte. Para el check-in muestra el código personal del participante.");
            }

            String[] parts = decoded.split(":");
            if (parts.length != 2) {
                throw new IllegalArgumentException("Formato de QR inválido. Asegúrate de escanear el código personal generado al registrarse.");
            }

            try {
                userId = Long.parseLong(parts[0]);
                eventId = Long.parseLong(parts[1]);
            } catch (NumberFormatException ex) {
                throw new IllegalArgumentException("El QR escaneado no corresponde a un registro válido.");
            }

            r = registrationRepository.findByUserIdAndEventId(userId, eventId)
                .orElseThrow(() -> new IllegalStateException("No se encontró un registro asociado a este QR."));
        } else if (body.getEventId() != null && body.getPassword() != null) {
            // Check-in con contraseña
            eventId = body.getEventId();
            com.univibe.event.model.Event event = eventRepository.findById(eventId).orElseThrow();
            
            // Verificar que el evento esté LIVE
            if (event.getStatus() != com.univibe.event.model.EventStatus.LIVE) {
                throw new IllegalStateException("El evento debe estar en curso (LIVE) para hacer check-in");
            }
            
            // Verificar la contraseña
            if (!body.getPassword().equals(event.getCheckInPassword())) {
                throw new IllegalArgumentException("Contraseña de check-in incorrecta");
            }
            
            // Buscar el registro del usuario
            r = registrationRepository.findByUserIdAndEventId(userId, eventId)
                .orElseThrow(() -> new IllegalStateException("Debes estar registrado al evento para hacer check-in"));
        } else {
            throw new IllegalArgumentException("Debe proporcionar payload (QR) o eventId + password");
        }

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

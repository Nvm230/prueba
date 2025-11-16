package com.univibe.integration.googlecalendar;

import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import com.univibe.registration.repo.RegistrationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/integration/googlecalendar")
public class GoogleCalendarController {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Value("${GOOGLE_CALENDAR_ACCESS_TOKEN:}")
    private String googleCalendarAccessToken;

    @Value("${GOOGLE_CALENDAR_ID:primary}")
    private String googleCalendarId;

    public GoogleCalendarController(EventRepository eventRepository, RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @PostMapping("/sync/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Map<String, Object> sync(@PathVariable Long eventId, Authentication auth) {
        if (googleCalendarAccessToken == null || googleCalendarAccessToken.isBlank()) {
            throw new IllegalStateException("Google Calendar access token not configured. Set GOOGLE_CALENDAR_ACCESS_TOKEN environment variable.");
        }

        Event event = eventRepository.findById(eventId).orElseThrow();
        Instant start = event.getStartTime() != null ? event.getStartTime() : Instant.now();
        Instant end = event.getEndTime() != null ? event.getEndTime() : start.plusSeconds(3600);

        // Obtener emails de usuarios registrados para invitarlos
        List<String> attendeeEmails = registrationRepository.findByEventId(eventId).stream()
                .map(reg -> reg.getUser().getEmail())
                .toList();

        // Formatear fechas en formato RFC3339
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        String startDateTime = formatter.format(start);
        String endDateTime = formatter.format(end);

        // Construir payload con invitados
        var payload = new java.util.HashMap<String, Object>();
        payload.put("summary", event.getTitle());
        payload.put("description", event.getDescription());
        payload.put("start", Map.of("dateTime", startDateTime, "timeZone", "UTC"));
        payload.put("end", Map.of("dateTime", endDateTime, "timeZone", "UTC"));

        // Agregar invitados si hay usuarios registrados
        if (!attendeeEmails.isEmpty()) {
            List<Map<String, String>> attendees = attendeeEmails.stream()
                    .map(email -> Map.of("email", email))
                    .toList();
            payload.put("attendees", attendees);
        }

        WebClient client = WebClient.builder()
                .baseUrl("https://www.googleapis.com/calendar/v3")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + googleCalendarAccessToken)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        Map response = client.post()
                .uri("/calendars/{calendarId}/events", googleCalendarId)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return response;
    }
}

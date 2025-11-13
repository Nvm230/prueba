package com.univibe.integration.googlecalendar;

import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController
@RequestMapping("/api/integration/googlecalendar")
public class GoogleCalendarController {

    private final EventRepository eventRepository;

    public GoogleCalendarController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @PostMapping("/sync/{eventId}")
    public Map<String, Object> sync(@PathVariable Long eventId, @RequestBody Map<String, String> body) {
        String accessToken = body.get("accessToken");
        String calendarId = body.getOrDefault("calendarId", "primary");
        if (accessToken == null || accessToken.isBlank()) {
            throw new IllegalArgumentException("accessToken is required");
        }
        Event event = eventRepository.findById(eventId).orElseThrow();
        Instant start = event.getStartTime() != null ? event.getStartTime() : Instant.now();
        Instant end = event.getEndTime() != null ? event.getEndTime() : start.plus(1, ChronoUnit.HOURS);
        var payload = Map.of(
                "summary", event.getTitle(),
                "description", event.getDescription(),
                "start", Map.of("dateTime", start.toString()),
                "end", Map.of("dateTime", end.toString())
        );
        WebClient client = WebClient.builder()
                .baseUrl("https://www.googleapis.com/calendar/v3")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        Map response = client.post()
                .uri("/calendars/{calendarId}/events", calendarId)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        return response;
    }
}

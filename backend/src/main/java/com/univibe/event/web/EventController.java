package com.univibe.event.web;

import com.univibe.common.dto.PageResponse;
import com.univibe.event.dto.EventCreateRequest;
import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import com.univibe.event.repo.EventRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public PageResponse<Event> list(
            @RequestParam Optional<EventStatus> status,
            @RequestParam Optional<String> category,
            @RequestParam Optional<String> search,
            @PageableDefault(size = 12, sort = "startTime", direction = Sort.Direction.ASC) Pageable pageable
    ) {

        Specification<Event> spec = Specification.where(null);

        // Filter by status
        if (status.isPresent()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status.get()));
        }

        // Filter by category
        if (category.isPresent() && StringUtils.hasText(category.get())) {
            String value = category.get().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower(root.get("category")), value));
        }

        // Filter by search text (title)
        if (search.isPresent() && StringUtils.hasText(search.get())) {
            String value = search.get().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + value + "%"));
        }

        Page<Event> page = eventRepository.findAll(spec, pageable);
        return PageResponse.from(page);
    }

    @GetMapping("/{eventId}")
    public Event getById(@PathVariable Long eventId) {
        return eventRepository.findById(eventId).orElseThrow();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Event create(@RequestBody @Valid EventCreateRequest req) {
        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setCategory(req.getCategory());
        event.setDescription(req.getDescription());
        event.setFaculty(req.getFaculty() != null && !req.getFaculty().trim().isEmpty() ? req.getFaculty() : null);
        event.setCareer(req.getCareer() != null && !req.getCareer().trim().isEmpty() ? req.getCareer() : null);
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        return eventRepository.save(event);
    }

    @PostMapping("/{eventId}/start")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Event start(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        event.setStatus(EventStatus.LIVE);
        return eventRepository.save(event);
    }

    @PostMapping("/{eventId}/finish")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Event finish(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        event.setStatus(EventStatus.FINISHED);
        return eventRepository.save(event);
    }
}

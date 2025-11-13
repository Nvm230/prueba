package com.univibe.controller;

import com.univibe.event.web.EventController;
import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import com.univibe.event.repo.EventRepository;
import com.univibe.event.dto.EventCreateRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class EventControllerTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventController eventController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListEvents() {
        Event e = new Event();
        e.setTitle("Tech Talk");
        when(eventRepository.findAll()).thenReturn(List.of(e));

        var result = eventController.list();

        assertEquals(1, result.size());
        assertEquals("Tech Talk", result.get(0).getTitle());
    }

    @Test
    void testCreateEvent() {
        EventCreateRequest req = new EventCreateRequest();
        Event e = new Event();
        e.setTitle("New Event");
        when(eventRepository.save(any(Event.class))).thenReturn(e);

        Event saved = eventController.create(req);

        assertEquals("New Event", saved.getTitle());
    }

    @Test
    void testStartEvent() {
        Event e = new Event();
        e.setStatus(EventStatus.LIVE);
        when(eventRepository.findById(1L)).thenReturn(Optional.of(e));
        when(eventRepository.save(any(Event.class))).thenReturn(e);

        Event result = eventController.start(1L);

        assertEquals(EventStatus.LIVE, result.getStatus());
    }
}

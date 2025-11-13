package com.univibe.controller;

import com.univibe.chat.web.ChatController;
import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import com.univibe.event.repo.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Optional;

import static org.mockito.Mockito.*;

class ChatControllerTest {

    @Mock private SimpMessagingTemplate messagingTemplate;
    @Mock private EventRepository eventRepository;
    @InjectMocks private ChatController chatController;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void testSendLiveEvent() {
        Event event = new Event();
        event.setStatus(EventStatus.LIVE);
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        chatController.send(1L, "Hola mundo");

        verify(messagingTemplate).convertAndSend("/topic/events.1", "Hola mundo");
    }
}

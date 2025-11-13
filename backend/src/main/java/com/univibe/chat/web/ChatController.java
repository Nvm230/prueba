package com.univibe.chat.web;

import com.univibe.event.model.EventStatus;
import com.univibe.event.repo.EventRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final EventRepository eventRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, EventRepository eventRepository) {
        this.messagingTemplate = messagingTemplate;
        this.eventRepository = eventRepository;
    }

    @MessageMapping("/chat.{eventId}.send")
    public void send(@DestinationVariable Long eventId, @Payload String message) {
        var event = eventRepository.findById(eventId).orElseThrow();
        if (event.getStatus() != EventStatus.LIVE) {
            return;
        }
        messagingTemplate.convertAndSend("/topic/events." + eventId, message);
    }
}

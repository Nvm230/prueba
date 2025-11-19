package com.univibe.call.web;

import com.univibe.call.model.CallSession;
import com.univibe.call.repo.CallSessionRepository;
import com.univibe.call.service.CallService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class CallSignalController {

    private final SimpMessagingTemplate messagingTemplate;
    private final CallSessionRepository callSessionRepository;
    private final CallService callService;
    private final UserRepository userRepository;

    public CallSignalController(SimpMessagingTemplate messagingTemplate,
                                CallSessionRepository callSessionRepository,
                                CallService callService,
                                UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.callSessionRepository = callSessionRepository;
        this.callService = callService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/call.{sessionId}")
    public void reenviarSignal(@DestinationVariable Long sessionId, @Payload String payload, Authentication auth) {
        User user = resolveUser(auth);
        CallSession session = callSessionRepository.findById(sessionId).orElseThrow();
        if (!session.isActivo()) {
            throw new AccessDeniedException("La llamada ya finalizó");
        }
        if (!callService.puedeUnirse(session, user)) {
            throw new AccessDeniedException("No puedes participar en esta llamada");
        }
        messagingTemplate.convertAndSend("/topic/call." + sessionId, payload);
    }

    private User resolveUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email).orElseThrow();
    }
}


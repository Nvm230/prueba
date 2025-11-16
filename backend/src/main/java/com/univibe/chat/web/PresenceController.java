package com.univibe.chat.web;

import com.univibe.chat.service.PresenceService;
import com.univibe.user.repo.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/presence")
public class PresenceController {
    
    private final PresenceService presenceService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public PresenceController(PresenceService presenceService, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.presenceService = presenceService;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }


    @GetMapping("/user/{userId}")
    public Map<String, Object> checkPresence(@PathVariable Long userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("online", presenceService.isUserOnline(userId));
        return result;
    }
}


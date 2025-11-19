package com.univibe.call.web;

import com.univibe.call.dto.CallSessionResponse;
import com.univibe.call.dto.CreateCallRequest;
import com.univibe.call.model.CallContextType;
import com.univibe.call.service.CallService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calls")
public class CallRestController {

    private final CallService callService;
    private final UserRepository userRepository;

    public CallRestController(CallService callService, UserRepository userRepository) {
        this.callService = callService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public CallSessionResponse createCall(@RequestBody CreateCallRequest request, Authentication auth) {
        User user = resolveUser(auth);
        return callService.createSession(request, user);
    }

    @GetMapping("/active")
    public ResponseEntity<CallSessionResponse> getActive(@RequestParam("contextType") CallContextType contextType,
                                                         @RequestParam("contextId") Long contextId,
                                                         Authentication auth) {
        User user = resolveUser(auth);
        return callService.findActive(contextType, contextId, user)
                .map(callService::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/{sessionId}/accept")
    public CallSessionResponse accept(@PathVariable Long sessionId, Authentication auth) {
        User user = resolveUser(auth);
        return callService.toResponse(callService.acceptSession(sessionId, user));
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<?> endCall(@PathVariable Long sessionId, Authentication auth) {
        User user = resolveUser(auth);
        CallSessionResponse response = callService.toResponse(callService.endSession(sessionId, user));
        return ResponseEntity.ok(response);
    }

    private User resolveUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email).orElseThrow();
    }
}


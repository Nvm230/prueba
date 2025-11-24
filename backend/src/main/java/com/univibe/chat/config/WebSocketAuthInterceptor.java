package com.univibe.chat.config;

import com.univibe.chat.service.PresenceService;
import com.univibe.security.JwtService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor, ChannelInterceptor {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketAuthInterceptor(JwtService jwtService, UserRepository userRepository, 
                                    PresenceService presenceService, @Lazy SimpMessagingTemplate messagingTemplate) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.presenceService = presenceService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                    WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            String authHeader = servletRequest.getServletRequest().getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    String email = jwtService.parse(token).getBody().getSubject();
                    User user = userRepository.findByEmail(email).orElse(null);
                    if (user != null) {
                        attributes.put("userEmail", email);
                        return true;
                    }
                } catch (Exception ignored) {}
            }
        }
        return true; // Permitir conexión, pero autenticación se verificará en el interceptor de canal
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // No-op
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor != null) {
            String sessionId = accessor.getSessionId();
            
            if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                String authHeader = accessor.getFirstNativeHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    try {
                        String email = jwtService.parse(token).getBody().getSubject();
                        User user = userRepository.findByEmail(email).orElse(null);
                        if (user != null) {
                            Principal principal = new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                            );
                            accessor.setUser(principal);
                            
                            // Registrar usuario como conectado
                            presenceService.userConnected(sessionId, user.getId());
                            
                            // Notificar a otros usuarios que este usuario está en línea
                            Map<String, Object> presenceUpdate = new HashMap<>();
                            presenceUpdate.put("userId", user.getId());
                            presenceUpdate.put("online", true);
                            messagingTemplate.convertAndSend("/topic/presence", presenceUpdate);
                        }
                    } catch (Exception ignored) {}
                }
            } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                // Registrar usuario como desconectado
                Long userId = presenceService.getUserIdFromSession(sessionId);
                if (userId != null) {
                    presenceService.userDisconnected(sessionId);
                    
                    // Solo notificar si el usuario realmente se desconectó (no tiene más sesiones)
                    if (!presenceService.isUserOnline(userId)) {
                        Map<String, Object> presenceUpdate = new HashMap<>();
                        presenceUpdate.put("userId", userId);
                        presenceUpdate.put("online", false);
                        messagingTemplate.convertAndSend("/topic/presence", presenceUpdate);
                    }
                }
            }
        }
        return message;
    }
}


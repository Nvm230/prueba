package com.univibe.call.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univibe.call.model.CallSession;
import com.univibe.call.repo.CallSessionRepository;
import com.univibe.call.service.CallService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CallSignalingHandler extends TextWebSocketHandler {

    private final Map<String, List<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final Map<WebSocketSession, String> sessionToRoom = new ConcurrentHashMap<>();
    private final Map<WebSocketSession, Long> sessionToUserId = new ConcurrentHashMap<>();
    private final CallSessionRepository callSessionRepository;
    private final CallService callService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public CallSignalingHandler(CallSessionRepository callSessionRepository,
                                CallService callService,
                                UserRepository userRepository,
                                ObjectMapper objectMapper) {
        this.callSessionRepository = callSessionRepository;
        this.callService = callService;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Verificar autenticación desde los query parameters o headers
        // Por ahora, el usuario se identifica en el mensaje "join" con validación
        System.out.println("[CallSignaling] New WebSocket connection: " + session.getId() + " from " + session.getRemoteAddress());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        if (payload == null || payload.trim().isEmpty()) {
            return;
        }

        try {
            Map<String, Object> data = objectMapper.readValue(payload, Map.class);
            String roomId = (String) data.get("room");
            String type = (String) data.get("type");

            if (roomId == null || type == null) {
                return;
            }

            // Validar que la sesión existe y está activa
            Long sessionId = Long.parseLong(roomId);
            CallSession callSession = callSessionRepository.findById(sessionId).orElse(null);
            if (callSession == null || !callSession.isActivo()) {
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of(
                    "type", "error",
                    "message", "La llamada no existe o ya finalizó"
                ))));
                return;
            }

            // Manejar JOIN
            if ("join".equals(type)) {
                Long userId = data.get("userId") != null ? Long.parseLong(data.get("userId").toString()) : null;
                if (userId == null) {
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of(
                        "type", "error",
                        "message", "userId requerido"
                    ))));
                    return;
                }

                User user = userRepository.findById(userId).orElse(null);
                if (user == null || !callService.puedeUnirse(callSession, user)) {
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of(
                        "type", "error",
                        "message", "No tienes permiso para unirte a esta llamada"
                    ))));
                    return;
                }

                rooms.putIfAbsent(roomId, new ArrayList<>());
                List<WebSocketSession> room = rooms.get(roomId);
                if (!room.contains(session)) {
                    room.add(session);
                    sessionToRoom.put(session, roomId);
                    sessionToUserId.put(session, userId);
                }

                // Notificar a otros participantes que alguien se unió
                Map<String, Object> joinNotification = new HashMap<>();
                joinNotification.put("type", "join");
                joinNotification.put("userId", userId);
                joinNotification.put("room", roomId);
                String joinMessage = objectMapper.writeValueAsString(joinNotification);
                System.out.println("[CallSignaling] User " + userId + " joined room " + roomId + ". Broadcasting to " + (room.size() - 1) + " other participants");
                broadcastToOthers(session, roomId, joinMessage);
                
                // También notificar al nuevo usuario sobre los participantes existentes
                // Esto es crítico para que ambos usuarios sepan del otro
                int notifiedCount = 0;
                for (WebSocketSession s : room) {
                    if (s != session && s.isOpen()) {
                        Long existingUserId = sessionToUserId.get(s);
                        if (existingUserId != null) {
                            Map<String, Object> existingUserNotification = new HashMap<>();
                            existingUserNotification.put("type", "join");
                            existingUserNotification.put("userId", existingUserId);
                            existingUserNotification.put("room", roomId);
                            try {
                                String existingUserMessage = objectMapper.writeValueAsString(existingUserNotification);
                                session.sendMessage(new TextMessage(existingUserMessage));
                                System.out.println("[CallSignaling] ✓ Notified new user " + userId + " about existing user " + existingUserId + " in room " + roomId);
                                notifiedCount++;
                            } catch (IOException e) {
                                System.err.println("[CallSignaling] ✗ Error notifying new user " + userId + " about existing user " + existingUserId + ": " + e.getMessage());
                                e.printStackTrace();
                            }
                        } else {
                            System.err.println("[CallSignaling] ✗ Warning: Existing session " + s.getId() + " has no userId mapped");
                        }
                    }
                }
                System.out.println("[CallSignaling] Total notifications sent to new user " + userId + ": " + notifiedCount + " existing participants (room size: " + room.size() + ")");
                return;
            }

            // Para otros tipos de mensajes (offer, answer, candidate), reenviar a otros
            String roomIdForSession = sessionToRoom.get(session);
            if (roomIdForSession != null && roomIdForSession.equals(roomId)) {
                Long fromUserId = sessionToUserId.get(session);
                System.out.println("[CallSignaling] Relaying " + type + " message from user " + fromUserId + " in room " + roomId);
                broadcastToOthers(session, roomId, payload);
            } else {
                System.err.println("[CallSignaling] ✗ Session " + session.getId() + " not in room " + roomId + " (current room: " + roomIdForSession + ")");
            }

        } catch (Exception e) {
            System.err.println("Error handling WebSocket message: " + e.getMessage());
            e.printStackTrace();
            try {
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of(
                    "type", "error",
                    "message", "Error procesando mensaje: " + e.getMessage()
                ))));
            } catch (IOException ignored) {
            }
        }
    }

    private void broadcastToOthers(WebSocketSession sender, String roomId, String message) {
        List<WebSocketSession> room = rooms.get(roomId);
        if (room == null) {
            return;
        }

        for (WebSocketSession s : room) {
            if (s != sender && s.isOpen()) {
                try {
                    s.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    System.err.println("Error sending message to session: " + e.getMessage());
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String roomId = sessionToRoom.remove(session);
        if (roomId != null) {
            List<WebSocketSession> room = rooms.get(roomId);
            if (room != null) {
                room.remove(session);
                if (room.isEmpty()) {
                    rooms.remove(roomId);
                }
            }
        }
        sessionToUserId.remove(session);
    }
}


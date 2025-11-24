package com.univibe.chat.service;

import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Service
public class PresenceService {
    // Mapa de userId -> Set de sessionIds (un usuario puede tener múltiples sesiones)
    private final Map<Long, Set<String>> userSessions = new ConcurrentHashMap<>();
    
    // Mapa de sessionId -> userId
    private final Map<String, Long> sessionToUser = new ConcurrentHashMap<>();
    
    private final UserRepository userRepository;

    public PresenceService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Registra que un usuario se ha conectado
     */
    public void userConnected(String sessionId, Long userId) {
        sessionToUser.put(sessionId, userId);
        userSessions.computeIfAbsent(userId, k -> new CopyOnWriteArraySet<>()).add(sessionId);
    }

    /**
     * Registra que un usuario se ha desconectado
     */
    public void userDisconnected(String sessionId) {
        Long userId = sessionToUser.remove(sessionId);
        if (userId != null) {
            Set<String> sessions = userSessions.get(userId);
            if (sessions != null) {
                sessions.remove(sessionId);
                if (sessions.isEmpty()) {
                    userSessions.remove(userId);
                }
            }
        }
    }

    /**
     * Verifica si un usuario está en línea
     */
    public boolean isUserOnline(Long userId) {
        Set<String> sessions = userSessions.get(userId);
        return sessions != null && !sessions.isEmpty();
    }

    /**
     * Obtiene todos los usuarios en línea
     */
    public Set<Long> getOnlineUsers() {
        return userSessions.keySet();
    }

    /**
     * Obtiene el número de sesiones activas de un usuario
     */
    public int getUserSessionCount(Long userId) {
        Set<String> sessions = userSessions.get(userId);
        return sessions != null ? sessions.size() : 0;
    }

    /**
     * Obtiene el userId asociado a una sesión (para desconexión)
     */
    public Long getUserIdFromSession(String sessionId) {
        return sessionToUser.get(sessionId);
    }
}


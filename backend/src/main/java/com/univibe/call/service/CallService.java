package com.univibe.call.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.univibe.call.dto.CallSessionResponse;
import com.univibe.call.dto.CreateCallRequest;
import com.univibe.call.model.CallContextType;
import com.univibe.call.model.CallMode;
import com.univibe.call.model.CallSession;
import com.univibe.call.repo.CallSessionRepository;
import com.univibe.chat.service.MessageResponseMapper;
import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import com.univibe.event.service.EventSecurityService;
import com.univibe.group.model.Group;
import com.univibe.group.repo.GroupRepository;
import com.univibe.notification.model.Notification;
import com.univibe.notification.repo.NotificationRepository;
import com.univibe.social.model.PrivateMessage;
import com.univibe.social.repo.FriendshipRepository;
import com.univibe.social.repo.PrivateMessageRepository;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import jakarta.annotation.PreDestroy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class CallService {

    private final CallSessionRepository callSessionRepository;
    private final FriendshipRepository friendshipRepository;
    private final GroupRepository groupRepository;
    private final EventRepository eventRepository;
    private final EventSecurityService eventSecurityService;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final PrivateMessageRepository privateMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageResponseMapper messageResponseMapper;
    private final ObjectMapper objectMapper;
    private final TransactionTemplate transactionTemplate;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public CallService(CallSessionRepository callSessionRepository,
                       FriendshipRepository friendshipRepository,
                       GroupRepository groupRepository,
                       EventRepository eventRepository,
                       EventSecurityService eventSecurityService,
                       UserRepository userRepository,
                       NotificationRepository notificationRepository,
                       PrivateMessageRepository privateMessageRepository,
                       SimpMessagingTemplate messagingTemplate,
                       MessageResponseMapper messageResponseMapper,
                       ObjectMapper objectMapper,
                       PlatformTransactionManager transactionManager) {
        this.callSessionRepository = callSessionRepository;
        this.friendshipRepository = friendshipRepository;
        this.groupRepository = groupRepository;
        this.eventRepository = eventRepository;
        this.eventSecurityService = eventSecurityService;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.privateMessageRepository = privateMessageRepository;
        this.messagingTemplate = messagingTemplate;
        this.messageResponseMapper = messageResponseMapper;
        this.objectMapper = objectMapper;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    @PreDestroy
    public void shutdownScheduler() {
        scheduler.shutdownNow();
    }

    @Transactional
    public CallSessionResponse createSession(CreateCallRequest request, User user) {
        validarContexto(request, user);
        callSessionRepository.findFirstByContextTypeAndContextIdAndActivoTrue(request.contextType(), request.contextId())
                .ifPresent(session -> {
                    session.setActivo(false);
                    callSessionRepository.save(session);
                });

        CallSession session = new CallSession();
        session.setContextType(request.contextType());
        session.setContextId(request.contextId());
        session.setMode(request.mode() != null ? request.mode() : CallMode.NORMAL);
        session.setCreatedBy(user);
        CallSession saved = callSessionRepository.save(session);

        if (saved.getContextType() == CallContextType.PRIVATE) {
            notifyIncomingCall(saved);
            scheduleMissedCheck(saved.getId());
        }

        return toResponse(saved);
    }

    public Optional<CallSession> findActive(CallContextType contextType, Long contextId, User requester) {
        if (contextType == CallContextType.PRIVATE) {
            return callSessionRepository
                    .findFirstByContextTypeAndActivoTrueAndCreatedByIdAndContextId(contextType, requester.getId(), contextId)
                    .or(() -> callSessionRepository
                            .findFirstByContextTypeAndActivoTrueAndCreatedByIdAndContextId(contextType, contextId, requester.getId()));
        }
        return callSessionRepository.findFirstByContextTypeAndContextIdAndActivoTrue(contextType, contextId);
    }

    @Transactional
    public CallSession acceptSession(Long sessionId, User user) {
        CallSession session = callSessionRepository.findById(sessionId).orElseThrow();
        if (!puedeUnirse(session, user)) {
            throw new IllegalArgumentException("No puedes unirte a esta llamada");
        }
        if (session.getAcceptedAt() == null) {
            session.setAcceptedAt(Instant.now());
            callSessionRepository.save(session);
        }
        return session;
    }

    @Transactional
    public CallSession endSession(Long sessionId, User requester) {
        CallSession session = callSessionRepository.findById(sessionId).orElseThrow();
        if (!session.isActivo()) {
            return session;
        }
        boolean esPropietario = session.getCreatedBy().getId().equals(requester.getId());
        boolean esAdmin = requester.getRole() == Role.ADMIN || requester.getRole() == Role.SERVER;
        boolean esReceptorPrivado = session.getContextType() == CallContextType.PRIVATE && session.getContextId().equals(requester.getId());
        if (!esPropietario && !esAdmin && !esReceptorPrivado) {
            throw new IllegalArgumentException("No autorizado para finalizar la llamada");
        }
        return finalizeSession(session);
    }

    @Transactional
    public void endSessionsForContext(CallContextType contextType, Long contextId) {
        List<CallSession> activeSessions = callSessionRepository.findByContextTypeAndContextIdAndActivoTrue(contextType, contextId);
        activeSessions.forEach(this::finalizeSession);
    }

    @Transactional(readOnly = true)
    public boolean puedeUnirse(CallSession session, User user) {
        return switch (session.getContextType()) {
            case PRIVATE -> session.getCreatedBy().getId().equals(user.getId()) || session.getContextId().equals(user.getId());
            case GROUP -> {
                Group group = groupRepository.findById(session.getContextId()).orElse(null);
                boolean isOrganizer = group != null && group.getOwner().getId().equals(user.getId());
                boolean isStaff = user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER;
                boolean isMember = group != null && group.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()));
                yield group != null && (isOrganizer || isStaff || isMember);
            }
            case EVENT -> {
                Event event = eventRepository.findById(session.getContextId()).orElse(null);
                boolean canAccess = event != null && eventSecurityService.canAccessEvent(event, user);
                boolean isOrganizer = event != null && event.getCreatedBy() != null && event.getCreatedBy().getId().equals(user.getId());
                boolean isStaff = user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER;
                yield event != null && (canAccess || isOrganizer || isStaff);
            }
        };
    }

    private void validarContexto(CreateCallRequest request, User user) {
        if (request.contextType() == null || request.contextId() == null) {
            throw new IllegalArgumentException("Contexto inválido");
        }
        switch (request.contextType()) {
            case PRIVATE -> validarPrivado(request.contextId(), user);
            case GROUP -> validarGrupo(request.contextId(), user);
            case EVENT -> validarEvento(request.contextId(), user);
        }
    }

    private void validarPrivado(Long otherUserId, User user) {
        boolean friends = friendshipRepository.existsByUser1IdAndUser2Id(user.getId(), otherUserId)
                || friendshipRepository.existsByUser1IdAndUser2Id(otherUserId, user.getId());
        if (!friends) {
            throw new IllegalArgumentException("Debes ser amigo para iniciar una llamada privada");
        }
    }

    private void validarGrupo(Long groupId, User user) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        boolean esPropietario = group.getOwner().getId().equals(user.getId());
        boolean esStaff = user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER;
        boolean esMiembro = group.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()));
        if (!esPropietario && !esStaff) {
            throw new IllegalArgumentException("Solo administradores del grupo pueden iniciar llamadas");
        }
        if (!esMiembro) {
            throw new IllegalArgumentException("No perteneces a este grupo");
        }
    }

    private void validarEvento(Long eventId, User user) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        boolean esCreador = event.getCreatedBy() != null && event.getCreatedBy().getId().equals(user.getId());
        boolean esStaff = user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER;
        if (!esCreador && !esStaff) {
            throw new IllegalArgumentException("Solo el organizador o un administrador pueden iniciar la llamada del evento");
        }
    }

    private void scheduleMissedCheck(Long sessionId) {
        scheduler.schedule(() -> {
            transactionTemplate.execute(status -> {
                CallSession session = callSessionRepository.findById(sessionId).orElse(null);
                if (session == null || !session.isActivo() || session.getAcceptedAt() != null) {
                    return null;
                }
                finalizeSession(session);
                return null;
            });
        }, 15, TimeUnit.SECONDS);
    }

    private void notifyIncomingCall(CallSession session) {
        User caller = session.getCreatedBy();
        User receiver = userRepository.findById(session.getContextId()).orElse(null);
        if (receiver == null) {
            return;
        }
        Notification notification = new Notification();
        notification.setRecipient(receiver);
        notification.setTitle("Videollamada entrante");
        notification.setMessage(caller.getName() + " está iniciando una llamada");
        notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/queue/notifications." + receiver.getId(), notification);
    }

    private void notifyCallSummary(Long sessionId) {
        CallSession session = callSessionRepository.findById(sessionId).orElse(null);
        if (session == null || session.getContextType() != CallContextType.PRIVATE) {
            return;
        }
        User caller = session.getCreatedBy();
        User receiver = userRepository.findById(session.getContextId()).orElse(null);
        if (receiver == null) {
            return;
        }
        String content;
        String mode;
        if (session.isMissed()) {
            content = "Llamada perdida";
            mode = "CALL_MISSED";
        } else {
            String duration = formatDuration(session.getDurationSeconds());
            content = "Llamada finalizada (" + duration + ")";
            mode = "CALL_COMPLETED";
        }
        sendPrivateSystemMessage(caller, receiver, content, mode);
    }

    private void sendPrivateSystemMessage(User sender, User receiver, String content, String mode) {
        PrivateMessage message = new PrivateMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setMode(mode);
        PrivateMessage saved = privateMessageRepository.save(message);
        try {
            var response = messageResponseMapper.toPrivateResponse(saved);
            String payload = objectMapper.writeValueAsString(response);
            messagingTemplate.convertAndSend("/queue/private." + sender.getId(), payload);
            messagingTemplate.convertAndSend("/queue/private." + receiver.getId(), payload);
        } catch (JsonProcessingException e) {
            // Ignorar errores de serialización para no interrumpir el flujo principal
        }
    }

    private CallSession finalizeSession(CallSession session) {
        if (!session.isActivo()) {
            return session;
        }
        session.setActivo(false);
        session.setEndedAt(Instant.now());
        boolean missed = session.getAcceptedAt() == null;
        session.setMissed(missed);
        if (missed) {
            session.setDurationSeconds(0);
        } else {
            int duration = (int) Duration.between(session.getAcceptedAt(), session.getEndedAt()).getSeconds();
            session.setDurationSeconds(Math.max(duration, 0));
        }
        CallSession saved = callSessionRepository.save(session);
        notifyCallSummary(saved.getId());
        publishCallSignal(saved.getId(), "END", session.getCreatedBy().getId());
        return saved;
    }

    private void publishCallSignal(Long sessionId, String type, Long from) {
        try {
            String payload = objectMapper.writeValueAsString(java.util.Map.of(
                    "type", type,
                    "from", from != null ? from : -1L
            ));
            messagingTemplate.convertAndSend("/topic/call." + sessionId, payload);
        } catch (JsonProcessingException ignored) {
        }
    }

    private String formatDuration(Integer durationSeconds) {
        if (durationSeconds == null || durationSeconds <= 0) {
            return "00:00";
        }
        int minutes = durationSeconds / 60;
        int seconds = durationSeconds % 60;
        return String.format("%02d:%02d", minutes, seconds);
    }

    public CallSessionResponse toResponse(CallSession session) {
        return new CallSessionResponse(
                session.getId(),
                session.getContextType(),
                session.getContextId(),
                session.getMode(),
                session.isActivo(),
                session.getCreatedAt(),
                session.getAcceptedAt(),
                session.getEndedAt(),
                session.getDurationSeconds(),
                session.isMissed(),
                session.getCreatedBy().getId()
        );
    }
}


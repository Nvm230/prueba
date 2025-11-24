package com.univibe.notification.web;

import com.univibe.common.dto.PageResponse;
import com.univibe.notification.model.Notification;
import com.univibe.notification.repo.NotificationRepository;
import com.univibe.notification.service.NotificationService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository, NotificationService notificationService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public PageResponse<Notification> list(
            @PathVariable Long userId,
            Authentication auth,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        var requester = userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
        if (!requester.getId().equals(userId) && (requester.getRole() == null || requester.getRole() != com.univibe.user.model.Role.ADMIN)) {
            throw new org.springframework.security.access.AccessDeniedException("Forbidden");
        }
        return PageResponse.from(notificationRepository.findByRecipientId(userId, pageable));
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Notification send(
            @PathVariable Long userId, 
            @RequestParam String title, 
            @RequestParam String message,
            @RequestParam(required = false, defaultValue = "false") boolean sendEmail) {
        User recipient = userRepository.findById(userId).orElseThrow();
        return notificationService.send(recipient, title, message, sendEmail);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId, Authentication auth) {
        var requester = userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
        int updated = notificationRepository.markAsRead(notificationId, requester.getId());
        if (updated > 0) {
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/mark-message-notifications-read/{senderName}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> markMessageNotificationsAsRead(@PathVariable String senderName, Authentication auth) {
        var requester = userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
        // Decodificar el nombre del usuario (puede venir codificado desde la URL)
        String decodedSenderName = java.net.URLDecoder.decode(senderName, java.nio.charset.StandardCharsets.UTF_8);
        String titlePattern = "Nuevo mensaje de " + decodedSenderName + "%";
        int updated = notificationRepository.markAsReadByTitlePattern(requester.getId(), titlePattern);
        return ResponseEntity.ok(Map.of("message", "Notifications marked as read", "count", updated));
    }
}

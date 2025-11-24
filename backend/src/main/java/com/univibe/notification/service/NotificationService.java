package com.univibe.notification.service;

import com.univibe.gamification.model.Achievement;
import com.univibe.notification.model.Notification;
import com.univibe.notification.repo.NotificationRepository;
import com.univibe.user.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final MailService mailService;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate, MailService mailService) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.mailService = mailService;
    }

    @Transactional
    public Notification send(User recipient, String title, String message, boolean sendEmail) {
        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setTitle(title);
        n.setMessage(message);
        notificationRepository.save(n);
        
        // Send via WebSocket in real-time
        try {
            messagingTemplate.convertAndSend("/queue/notifications." + recipient.getId(), n);
        } catch (Exception e) {
            logger.error("Failed to send WebSocket notification to user {}", recipient.getId(), e);
        }
        
        // Send via email if enabled
        if (sendEmail) {
            try {
                if (recipient.getEmail() != null && !recipient.getEmail().isBlank()) {
                    String htmlContent = mailService.createNotificationEmail(
                        title,
                        message,
                        recipient.getName() != null ? recipient.getName() : "Usuario"
                    );
                    mailService.sendHtmlEmail(recipient.getEmail(), title, htmlContent);
                }
            } catch (Exception e) {
                logger.error("Failed to send email notification to user {}", recipient.getId(), e);
            }
        }
        
        return n;
    }

    @Transactional
    public void notifyAchievementUnlocked(User user, Achievement achievement) {
        String title = "🏆 Achievement Unlocked: " + achievement.getName();
        String message = "Congratulations! You've unlocked the '" + achievement.getName() + "' achievement and earned " + achievement.getPoints() + " points!";
        
        // Send notification (no email for achievements to avoid spam, unless we want it)
        send(user, title, message, false);
        
        // We could also send a specific "achievement" event via WebSocket for special frontend effects
        try {
            messagingTemplate.convertAndSend("/queue/achievements." + user.getId(), achievement);
        } catch (Exception e) {
            logger.error("Failed to send achievement WebSocket event to user {}", user.getId(), e);
        }
    }
}

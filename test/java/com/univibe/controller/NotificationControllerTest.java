package com.univibe.controller;

import com.univibe.notification.model.Notification;
import com.univibe.notification.repo.NotificationRepository;
import com.univibe.notification.web.NotificationController;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class NotificationControllerTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationController notificationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListNotifications() {
        User u = new User();
        u.setId(1L);
        u.setEmail("test@univibe.com");

        when(userRepository.findByEmail("test@univibe.com")).thenReturn(Optional.of(u));
        when(notificationRepository.findByRecipientIdOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(new Notification()));

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn("test@univibe.com");

        var result = notificationController.list(1L, auth);

        verify(notificationRepository, times(1)).findByRecipientIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void testSendNotification() {
        User recipient = new User();
        recipient.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(recipient));
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Notification result = notificationController.send(1L, "Hi", "Message");

        verify(messagingTemplate, times(1))
                .convertAndSend(eq("/queue/notifications.1"), any(Notification.class));

        verify(notificationRepository, times(1)).save(any(Notification.class));
    }
}

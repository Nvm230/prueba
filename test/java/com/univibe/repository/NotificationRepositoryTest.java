package com.univibe.repository;

import com.univibe.notification.model.Notification;
import com.univibe.notification.repo.NotificationRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import com.univibe.utils.TestFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFindByRecipientIdOrderByCreatedAtDesc() {
        User user = userRepository.save(TestFactory.sampleUser("recipient@test.com"));

        Notification n = new Notification();
        n.setTitle("New Notification");
        n.setMessage("Testing message");
        n.setRecipient(user);
        notificationRepository.save(n);

        List<Notification> found = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
        assertThat(found).isNotEmpty();
        assertThat(found.get(0).getTitle()).isEqualTo("New Notification");
    }
}

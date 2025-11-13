package com.univibe.repository;

import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import com.univibe.registration.model.Registration;
import com.univibe.registration.model.RegistrationStatus;
import com.univibe.registration.repo.RegistrationRepository;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RegistrationRepositoryTest {

    @Autowired private RegistrationRepository registrationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EventRepository eventRepository;

    private User createUser(String email) {
        User u = new User();
        u.setEmail(email);
        u.setName("Test User");
        u.setPasswordHash("dummy");
        u.setRole(Role.USER);
        u.setPoints(0);
        u.setCreatedAt(Instant.now());
        return userRepository.save(u);
    }

    private Event createEvent(String title) {
        Event e = new Event();
        e.setTitle(title);
        e.setCategory("General");
        e.setDescription("Sample");
        e.setFaculty("UTEC");
        e.setCareer("Software");
        e.setStartTime(Instant.now());
        e.setEndTime(Instant.now().plusSeconds(3600));
        return eventRepository.save(e);
    }

    @Test
    void testFindByUserAndEvent() {
        User user = createUser("user1@test.com");
        Event event = createEvent("Hackathon");

        Registration r = new Registration();
        r.setUser(user);
        r.setEvent(event);
        r.setQrCode("QRCODE123"); 
        registrationRepository.save(r);

        Optional<Registration> found =
                registrationRepository.findByUserIdAndEventId(user.getId(), event.getId());
        assertThat(found).isPresent();
    }

    @Test
    void testCountByEventAndStatus() {
        User user = createUser("user2@test.com");
        Event event = createEvent("Fair");

        Registration r = new Registration();
        r.setUser(user);
        r.setEvent(event);
        r.setStatus(RegistrationStatus.CHECKED_IN);
        r.setQrCode("QR2");
        registrationRepository.save(r);

        long count = registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.CHECKED_IN);
        assertThat(count).isEqualTo(1);
    }

    @Test
    void testFindByEvent() {
        User user = createUser("user3@test.com");
        Event event = createEvent("Repo Event");

        Registration r = new Registration();
        r.setUser(user);
        r.setEvent(event);
        r.setQrCode("QREVT");
        registrationRepository.save(r);

        List<Registration> found = registrationRepository.findByEventId(event.getId());
        assertThat(found).isNotEmpty();
    }
}

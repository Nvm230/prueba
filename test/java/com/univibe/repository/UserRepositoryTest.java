package com.univibe.repository;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User createValidUser(String email) {
        User u = new User();
        u.setEmail(email);
        u.setName("Test User");
        u.setPasswordHash("dummy123");
        u.setRole(Role.USER);
        u.setPoints(0);
        u.setCreatedAt(Instant.now());
        return u;
    }

    @Test
    void testFindByEmail() {
        User user = createValidUser("repo@univibe.com");
        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("repo@univibe.com");
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test User");
    }

    @Test
    void testExistsByEmail() {
        User user = createValidUser("check@univibe.com");
        userRepository.save(user);

        boolean exists = userRepository.existsByEmail("check@univibe.com");
        assertThat(exists).isTrue();
    }
}

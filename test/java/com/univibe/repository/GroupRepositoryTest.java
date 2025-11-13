package com.univibe.repository;

import com.univibe.group.model.Group;
import com.univibe.group.repo.GroupRepository;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class GroupRepositoryTest {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    private User createOwner() {
        User u = new User();
        u.setEmail("owner@test.com");
        u.setName("Owner User");
        u.setPasswordHash("dummy");
        u.setRole(Role.USER);
        u.setPoints(0);
        u.setCreatedAt(Instant.now());
        return userRepository.save(u);
    }

    @Test
    void testFindByName() {
        User owner = createOwner();

        Group g = new Group();
        g.setName("Backend Team");
        g.setOwner(owner);
        groupRepository.save(g);

        Optional<Group> found = groupRepository.findByName("Backend Team");
        assertThat(found).isPresent();
        assertThat(found.get().getOwner().getEmail()).isEqualTo("owner@test.com");
    }
}

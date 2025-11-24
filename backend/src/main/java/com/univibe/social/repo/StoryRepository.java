package com.univibe.social.repo;

import com.univibe.social.model.Story;
import com.univibe.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByUserAndIsActiveTrueAndExpiresAtAfter(User user, Instant now);
    List<Story> findByIsActiveTrueAndExpiresAtAfter(Instant now);
    List<Story> findByUser(User user);
    long countByUser(User user);
}




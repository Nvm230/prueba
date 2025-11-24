package com.univibe.gamification.repo;

import com.univibe.gamification.model.Achievement;
import com.univibe.gamification.model.UserAchievement;
import com.univibe.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUser(User user);
    Optional<UserAchievement> findByUserAndAchievement(User user, Achievement achievement);
}

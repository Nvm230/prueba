package com.univibe.gamification.service;

import com.univibe.gamification.model.Achievement;
import com.univibe.gamification.model.UserAchievement;
import com.univibe.gamification.repo.AchievementRepository;
import com.univibe.gamification.repo.UserAchievementRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GamificationService {

    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public GamificationService(UserRepository userRepository, AchievementRepository achievementRepository, UserAchievementRepository userAchievementRepository) {
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    @Transactional
    public void addPoints(Long userId, int points) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setPoints(user.getPoints() + points);
        userRepository.save(user);
    }

    @Transactional
    public void awardAchievement(Long userId, String achievementCode) {
        User user = userRepository.findById(userId).orElseThrow();
        Achievement achievement = achievementRepository.findByCode(achievementCode)
                .orElseGet(() -> {
                    Achievement a = new Achievement();
                    a.setCode(achievementCode);
                    a.setName(achievementCode);
                    return achievementRepository.save(a);
                });
        UserAchievement ua = new UserAchievement();
        ua.setUser(user);
        ua.setAchievement(achievement);
        userAchievementRepository.save(ua);
    }
}

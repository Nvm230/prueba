package com.univibe.gamification.service;

import com.univibe.gamification.model.Achievement;
import com.univibe.gamification.model.UserAchievement;
import com.univibe.gamification.repo.AchievementRepository;
import com.univibe.gamification.repo.UserAchievementRepository;
import com.univibe.notification.service.NotificationService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class AchievementService {
    
    private static final Logger logger = LoggerFactory.getLogger(AchievementService.class);
    
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public AchievementService(
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    
    /**
     * Check and award achievement if criteria met
     * @param user The user to check
     * @param achievementCode The achievement code to check
     * @param currentProgress Current progress value
     */
    @Transactional
    public void checkAndAwardAchievement(User user, String achievementCode, int currentProgress) {
        Optional<Achievement> achievementOpt = achievementRepository.findByCode(achievementCode);
        if (achievementOpt.isEmpty()) {
            logger.warn("Achievement not found: {}", achievementCode);
            return;
        }
        
        Achievement achievement = achievementOpt.get();
        
        // Check if already earned
        Optional<UserAchievement> existingOpt = userAchievementRepository.findByUserAndAchievement(user, achievement);
        if (existingOpt.isPresent() && existingOpt.get().getProgress() >= achievement.getMaxProgress()) {
            return; // Already earned
        }
        
        // Update or create progress
        UserAchievement userAchievement;
        if (existingOpt.isPresent()) {
            userAchievement = existingOpt.get();
            userAchievement.setProgress(currentProgress);
        } else {
            userAchievement = new UserAchievement();
            userAchievement.setUser(user);
            userAchievement.setAchievement(achievement);
            userAchievement.setProgress(currentProgress);
            userAchievement.setEarnedAt(Instant.now());
        }
        
        // Check if achievement should be awarded
        if (currentProgress >= achievement.getMaxProgress()) {
            userAchievement.setProgress(achievement.getMaxProgress());
            userAchievementRepository.save(userAchievement);
            
            // Award points
            user.setPoints(user.getPoints() + achievement.getPoints());
            userRepository.save(user);
            
            // Send notification
            notificationService.notifyAchievementUnlocked(user, achievement);
            
            logger.info("Achievement unlocked: {} for user {}", achievement.getName(), user.getEmail());
        } else {
            userAchievementRepository.save(userAchievement);
            logger.debug("Progress updated for {}: {}/{}", achievement.getName(), currentProgress, achievement.getMaxProgress());
        }
    }
    
    /**
     * Award achievement immediately without progress check
     */
    @Transactional
    public UserAchievement awardAchievement(User user, Achievement achievement) {
        // Check if already earned
        Optional<UserAchievement> existingOpt = userAchievementRepository.findByUserAndAchievement(user, achievement);
        if (existingOpt.isPresent()) {
            return existingOpt.get();
        }
        
        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setUser(user);
        userAchievement.setAchievement(achievement);
        userAchievement.setProgress(achievement.getMaxProgress());
        userAchievement.setEarnedAt(Instant.now());
        userAchievementRepository.save(userAchievement);
        
        // Award points
        user.setPoints(user.getPoints() + achievement.getPoints());
        userRepository.save(user);
        
        // Send notification
        notificationService.notifyAchievementUnlocked(user, achievement);
        
        logger.info("Achievement awarded: {} to user {}", achievement.getName(), user.getEmail());
        return userAchievement;
    }
    
    /**
     * Award achievement by code
     */
    @Transactional
    public void awardAchievementByCode(User user, String achievementCode) {
        Optional<Achievement> achievementOpt = achievementRepository.findByCode(achievementCode);
        if (achievementOpt.isEmpty()) {
            logger.warn("Achievement not found: {}", achievementCode);
            return;
        }
        awardAchievement(user, achievementOpt.get());
    }
    
    /**
     * Update progress for an achievement
     */
    @Transactional
    public void updateProgress(User user, String achievementCode, int newProgress) {
        checkAndAwardAchievement(user, achievementCode, newProgress);
    }
    
    /**
     * Increment progress by 1
     */
    @Transactional
    public void incrementProgress(User user, String achievementCode) {
        int currentProgress = getUserProgress(user, achievementCode);
        checkAndAwardAchievement(user, achievementCode, currentProgress + 1);
    }
    
    /**
     * Get current progress for an achievement
     */
    public int getUserProgress(User user, String achievementCode) {
        Optional<Achievement> achievementOpt = achievementRepository.findByCode(achievementCode);
        if (achievementOpt.isEmpty()) {
            return 0;
        }
        
        Achievement achievement = achievementOpt.get();
        Optional<UserAchievement> userAchievementOpt = userAchievementRepository.findByUserAndAchievement(user, achievement);
        
        return userAchievementOpt.map(UserAchievement::getProgress).orElse(0);
    }
    
    /**
     * Check if user has earned an achievement
     */
    public boolean hasAchievement(User user, String achievementCode) {
        Optional<Achievement> achievementOpt = achievementRepository.findByCode(achievementCode);
        if (achievementOpt.isEmpty()) {
            return false;
        }
        
        Achievement achievement = achievementOpt.get();
        Optional<UserAchievement> userAchievementOpt = userAchievementRepository.findByUserAndAchievement(user, achievement);
        
        return userAchievementOpt.isPresent() && 
               userAchievementOpt.get().getProgress() >= achievement.getMaxProgress();
    }
}

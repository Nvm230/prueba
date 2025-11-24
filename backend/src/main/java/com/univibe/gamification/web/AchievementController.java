package com.univibe.gamification.web;

import com.univibe.common.exception.NotFoundException;
import com.univibe.gamification.model.Achievement;
import com.univibe.gamification.model.UserAchievement;
import com.univibe.gamification.repo.AchievementRepository;
import com.univibe.gamification.repo.UserAchievementRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserRepository userRepository;

    public AchievementController(
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository,
            UserRepository userRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyAchievements(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        List<UserAchievement> userAchievements = userAchievementRepository.findByUser(user);
        
        List<Map<String, Object>> result = userAchievements.stream()
                .map(ua -> Map.of(
                        "id", ua.getId(),
                        "achievement", Map.of(
                                "id", ua.getAchievement().getId(),
                                "code", ua.getAchievement().getCode(),
                                "name", ua.getAchievement().getName(),
                                "description", ua.getAchievement().getDescription() != null ? ua.getAchievement().getDescription() : ""
                        ),
                        "earnedAt", ua.getEarnedAt().toString()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllAchievements(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        List<Achievement> allAchievements = achievementRepository.findAll();
        Set<Long> earnedAchievementIds = userAchievementRepository.findByUser(user).stream()
                .map(ua -> ua.getAchievement().getId())
                .collect(Collectors.toSet());
        
        List<Map<String, Object>> result = allAchievements.stream()
                .map(achievement -> {
                    boolean earned = earnedAchievementIds.contains(achievement.getId());
                    UserAchievement userAchievement = earned 
                            ? userAchievementRepository.findByUserAndAchievement(user, achievement).orElse(null)
                            : null;
                    
                    return Map.of(
                            "achievement", Map.of(
                                    "id", achievement.getId(),
                                    "code", achievement.getCode(),
                                    "name", achievement.getName(),
                                    "description", achievement.getDescription() != null ? achievement.getDescription() : "",
                                    "category", getCategoryFromCode(achievement.getCode()),
                                    "rarity", getRarityFromCode(achievement.getCode())
                            ),
                            "earned", earned,
                            "earnedAt", userAchievement != null ? userAchievement.getEarnedAt().toString() : null,
                            "progress", 0,
                            "maxProgress", 1
                    );
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAchievementStats(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        List<Achievement> allAchievements = achievementRepository.findAll();
        Set<Long> earnedAchievementIds = userAchievementRepository.findByUser(user).stream()
                .map(ua -> ua.getAchievement().getId())
                .collect(Collectors.toSet());
        
        Map<String, Long> byCategory = allAchievements.stream()
                .collect(Collectors.groupingBy(
                        a -> getCategoryFromCode(a.getCode()),
                        Collectors.counting()
                ));
        
        return ResponseEntity.ok(Map.of(
                "total", allAchievements.size(),
                "earned", earnedAchievementIds.size(),
                "byCategory", byCategory
        ));
    }

    private String getCategoryFromCode(String code) {
        if (code.startsWith("PARTICIPATION_")) return "PARTICIPATION";
        if (code.startsWith("PROFILE_")) return "PROFILE";
        if (code.startsWith("INTERACTION_")) return "INTERACTION";
        if (code.startsWith("CREATIVITY_")) return "CREATIVITY";
        if (code.startsWith("EXPLORATION_")) return "EXPLORATION";
        if (code.startsWith("RARE_") || code.startsWith("LEGENDARY_")) return "RARE";
        if (code.startsWith("HIDDEN_") || code.startsWith("EASTER_")) return "HIDDEN";
        return "COMMON";
    }

    private String getRarityFromCode(String code) {
        if (code.contains("LEGENDARY") || code.contains("_LEGENDARY")) return "LEGENDARY";
        if (code.contains("EPIC") || code.contains("_EPIC")) return "EPIC";
        if (code.contains("RARE") || code.contains("_RARE")) return "RARE";
        if (code.contains("HIDDEN") || code.contains("EASTER")) return "HIDDEN";
        return "COMMON";
    }
}


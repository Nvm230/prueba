package com.univibe.service;

import com.univibe.gamification.model.Achievement;
import com.univibe.gamification.model.UserAchievement;
import com.univibe.gamification.repo.AchievementRepository;
import com.univibe.gamification.repo.UserAchievementRepository;
import com.univibe.gamification.service.GamificationService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GamificationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AchievementRepository achievementRepository;

    @Mock
    private UserAchievementRepository userAchievementRepository;

    @InjectMocks
    private GamificationService gamificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddPoints() {
        User user = new User();
        user.setId(1L);
        user.setPoints(10);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        gamificationService.addPoints(1L, 5);

        verify(userRepository, times(1)).save(user);
        assert user.getPoints() == 15;
    }

    @Test
    void testAwardAchievement_NewAchievement() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(achievementRepository.findByCode("CODE1")).thenReturn(Optional.empty());
        when(achievementRepository.save(any(Achievement.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        gamificationService.awardAchievement(1L, "CODE1");

        verify(userAchievementRepository, times(1)).save(any(UserAchievement.class));
    }
}

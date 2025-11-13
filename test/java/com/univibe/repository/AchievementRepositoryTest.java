package com.univibe.repository;

import com.univibe.gamification.model.Achievement;
import com.univibe.gamification.repo.AchievementRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class AchievementRepositoryTest {

    @Autowired
    private AchievementRepository achievementRepository;

    @Test
    void testFindByCode() {
        Achievement a = new Achievement();
        a.setCode("ACHV001");
        a.setName("First Login");
        achievementRepository.save(a);

        Optional<Achievement> found = achievementRepository.findByCode("ACHV001");
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("First Login");
    }
}

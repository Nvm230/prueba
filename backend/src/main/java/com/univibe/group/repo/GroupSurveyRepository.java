package com.univibe.group.repo;

import com.univibe.group.model.GroupSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupSurveyRepository extends JpaRepository<GroupSurvey, Long> {
    List<GroupSurvey> findByGroupIdOrderByCreatedAtDesc(Long groupId);
    boolean existsByGroupIdAndSurveyId(Long groupId, Long surveyId);
    void deleteBySurveyIdIn(List<Long> surveyIds);
}








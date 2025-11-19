package com.univibe.survey.repo;

import com.univibe.survey.model.Survey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
    @EntityGraph(attributePaths = {"questions"})
    List<Survey> findByEventId(Long eventId);

    @EntityGraph(attributePaths = {"questions"})
    Page<Survey> findByEventId(Long eventId, Pageable pageable);

    @EntityGraph(attributePaths = {"questions"})
    @Override
    List<Survey> findAll();

    @EntityGraph(attributePaths = {"questions"})
    @Override
    Page<Survey> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"questions"})
    @Override
    java.util.Optional<Survey> findById(Long id);

    void deleteByEventId(Long eventId);
}

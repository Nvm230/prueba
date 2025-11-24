package com.univibe.event.repo;

import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    List<Event> findByStatus(EventStatus status);
    List<Event> findByCategory(String category);
    
    @EntityGraph(attributePaths = {"createdBy"})
    Optional<Event> findById(Long id);
    
    @EntityGraph(attributePaths = {"createdBy"})
    Page<Event> findAll(Specification<Event> spec, Pageable pageable);
    
    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.createdBy WHERE LOWER(e.title) = LOWER(:title) AND e.startTime = :startTime")
    Optional<Event> findByTitleIgnoreCaseAndStartTime(@Param("title") String title, @Param("startTime") Instant startTime);
}

package com.univibe.group.repo;

import com.univibe.group.model.GroupEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupEventRepository extends JpaRepository<GroupEvent, Long> {
    List<GroupEvent> findByGroupIdOrderByCreatedAtDesc(Long groupId);
    boolean existsByGroupIdAndEventId(Long groupId, Long eventId);
    List<GroupEvent> findByEventId(Long eventId);
    boolean existsByEventId(Long eventId);
}








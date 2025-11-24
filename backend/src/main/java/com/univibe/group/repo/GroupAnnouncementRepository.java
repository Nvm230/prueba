package com.univibe.group.repo;

import com.univibe.group.model.GroupAnnouncement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupAnnouncementRepository extends JpaRepository<GroupAnnouncement, Long> {
    Page<GroupAnnouncement> findByGroupIdOrderByCreatedAtDesc(Long groupId, Pageable pageable);
}








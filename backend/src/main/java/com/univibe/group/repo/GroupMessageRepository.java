package com.univibe.group.repo;

import com.univibe.group.model.GroupMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    Page<GroupMessage> findByGroupIdOrderByCreatedAtAsc(Long groupId, Pageable pageable);
}








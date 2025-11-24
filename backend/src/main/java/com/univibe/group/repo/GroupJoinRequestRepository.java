package com.univibe.group.repo;

import com.univibe.group.model.GroupJoinRequest;
import com.univibe.group.model.GroupJoinRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupJoinRequestRepository extends JpaRepository<GroupJoinRequest, Long> {
    List<GroupJoinRequest> findByGroupIdAndStatus(Long groupId, GroupJoinRequestStatus status);
    Optional<GroupJoinRequest> findByGroupIdAndUserIdAndStatus(Long groupId, Long userId, GroupJoinRequestStatus status);
}


package com.univibe.social.repo;

import com.univibe.social.model.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    Optional<FriendRequest> findBySenderIdAndReceiverId(Long senderId, Long receiverId);
    List<FriendRequest> findByReceiverIdAndStatus(Long receiverId, FriendRequest.FriendRequestStatus status);
    List<FriendRequest> findBySenderIdAndStatus(Long senderId, FriendRequest.FriendRequestStatus status);
}








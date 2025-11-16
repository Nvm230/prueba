package com.univibe.social.repo;

import com.univibe.social.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    Optional<Friendship> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);
    List<Friendship> findByUser1IdOrUser2Id(Long user1Id, Long user2Id);
    boolean existsByUser1IdAndUser2Id(Long user1Id, Long user2Id);
}








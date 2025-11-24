package com.univibe.social.repo;

import com.univibe.social.model.Friendship;
import com.univibe.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    Optional<Friendship> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);
    List<Friendship> findByUser1IdOrUser2Id(Long user1Id, Long user2Id);
    boolean existsByUser1IdAndUser2Id(Long user1Id, Long user2Id);
    
    @Query("SELECT COUNT(f) FROM Friendship f WHERE f.user1 = :user OR f.user2 = :user")
    long countByUser(@Param("user") User user);
}








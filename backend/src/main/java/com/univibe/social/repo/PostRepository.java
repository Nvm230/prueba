package com.univibe.social.repo;

import com.univibe.social.model.Post;
import com.univibe.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // Achievement tracking methods
    long countByUser(User user);
    long countByUserAndMediaUrlIsNotNull(User user);
    long countByUserAndMusicUrlIsNotNull(User user);
    
    @Query("SELECT COALESCE(SUM(SIZE(p.likedBy)), 0) FROM Post p WHERE p.user = :user")
    long countTotalLikesByUser(@Param("user") User user);
}




package com.univibe.social.repo;

import com.univibe.social.model.PrivateMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrivateMessageRepository extends JpaRepository<PrivateMessage, Long> {
    @EntityGraph(attributePaths = {"sender", "receiver", "sticker"})
    @Query("SELECT m FROM PrivateMessage m WHERE (m.sender.id = :userId1 AND m.receiver.id = :userId2) OR (m.sender.id = :userId2 AND m.receiver.id = :userId1) ORDER BY m.createdAt ASC")
    Page<PrivateMessage> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2, Pageable pageable);
    
    @Query("SELECT DISTINCT CASE WHEN m.sender.id = :userId THEN m.receiver.id ELSE m.sender.id END " +
           "FROM PrivateMessage m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<Long> findConversationPartnerIds(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(m) FROM PrivateMessage m WHERE m.receiver.id = :userId AND m.sender.id = :senderId AND m.readFlag = false")
    long countUnreadMessages(@Param("userId") Long userId, @Param("senderId") Long senderId);
    
    @Query("SELECT COUNT(m) FROM PrivateMessage m WHERE m.receiver.id = :userId AND m.readFlag = false")
    long countUnreadMessagesForUser(@Param("userId") Long userId);
}


package com.univibe.notification.repo;

import com.univibe.notification.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    Page<Notification> findByRecipientId(Long recipientId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :recipientId AND n.title LIKE :titlePattern AND n.readFlag = false")
    List<Notification> findUnreadByRecipientIdAndTitlePattern(@Param("recipientId") Long recipientId, @Param("titlePattern") String titlePattern);
    
    @Modifying
    @Query("UPDATE Notification n SET n.readFlag = true WHERE n.id = :id AND n.recipient.id = :recipientId")
    int markAsRead(@Param("id") Long id, @Param("recipientId") Long recipientId);
    
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Notification n SET n.readFlag = true WHERE n.recipient.id = :recipientId AND n.title LIKE :titlePattern AND n.readFlag = false")
    int markAsReadByTitlePattern(@Param("recipientId") Long recipientId, @Param("titlePattern") String titlePattern);
}

package com.univibe.support.repo;

import com.univibe.support.model.SupportTicket;
import com.univibe.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    @Query("SELECT DISTINCT t FROM SupportTicket t " +
           "LEFT JOIN FETCH t.requester " +
           "LEFT JOIN FETCH t.mensajes m " +
           "LEFT JOIN FETCH m.sender " +
           "WHERE t.requester = :requester " +
           "ORDER BY t.updatedAt DESC")
    List<SupportTicket> findByRequesterOrderByUpdatedAtDesc(@Param("requester") User requester);
    
    List<SupportTicket> findAllByOrderByUpdatedAtDesc();
    
    @Query("SELECT t.requester.id FROM SupportTicket t WHERE t.id = :id")
    Optional<Long> findRequesterIdById(@Param("id") Long id);
    
    @Query("SELECT DISTINCT t FROM SupportTicket t " +
           "LEFT JOIN FETCH t.requester r " +
           "LEFT JOIN FETCH t.mensajes m " +
           "LEFT JOIN FETCH m.sender s " +
           "WHERE t.id = :id " +
           "ORDER BY m.createdAt ASC")
    Optional<SupportTicket> findByIdWithMessages(@Param("id") Long id);
}






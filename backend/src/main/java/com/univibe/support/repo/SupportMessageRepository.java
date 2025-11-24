package com.univibe.support.repo;

import com.univibe.support.model.SupportMessage;
import com.univibe.support.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
    List<SupportMessage> findByTicketOrderByCreatedAtAsc(SupportTicket ticket);
}

















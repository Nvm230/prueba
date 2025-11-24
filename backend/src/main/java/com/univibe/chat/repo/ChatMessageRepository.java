package com.univibe.chat.repo;

import com.univibe.chat.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByEventIdOrderByCreatedAtAsc(Long eventId, Pageable pageable);
}








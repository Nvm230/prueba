package com.univibe.event.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class EventSchemaInitializer {

    private static final Logger log = LoggerFactory.getLogger(EventSchemaInitializer.class);
    private final JdbcTemplate jdbcTemplate;

    public EventSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void ensureVisibilityColumn() {
        try {
            jdbcTemplate.execute("ALTER TABLE events ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC'");
        } catch (Exception ex) {
            log.warn("Failed to ensure events.visibility column: {}", ex.getMessage());
        }
    }
}


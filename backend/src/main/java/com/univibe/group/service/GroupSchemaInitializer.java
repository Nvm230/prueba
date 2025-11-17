package com.univibe.group.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class GroupSchemaInitializer {

    private static final Logger log = LoggerFactory.getLogger(GroupSchemaInitializer.class);
    private final JdbcTemplate jdbcTemplate;

    public GroupSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void ensureMembersCanChatColumn() {
        try {
            // Verificar si la columna existe
            Boolean columnExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) > 0 FROM information_schema.columns " +
                "WHERE table_name = 'groups' AND column_name = 'members_can_chat'",
                Boolean.class
            );
            
            if (columnExists == null || !columnExists) {
                log.info("Adding members_can_chat column to groups table");
                jdbcTemplate.execute(
                    "ALTER TABLE groups ADD COLUMN members_can_chat BOOLEAN NOT NULL DEFAULT false"
                );
                log.info("Successfully added members_can_chat column");
            } else {
                log.debug("Column members_can_chat already exists in groups table");
            }
        } catch (Exception ex) {
            log.warn("Failed to ensure groups.members_can_chat column: {}", ex.getMessage());
        }
    }
}


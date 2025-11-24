package com.univibe.group.repo;

import com.univibe.group.model.Group;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByName(String name);
    Page<Group> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

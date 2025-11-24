package com.univibe.sticker.repo;

import com.univibe.sticker.model.Sticker;
import com.univibe.user.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StickerRepository extends JpaRepository<Sticker, Long> {
    @EntityGraph(attributePaths = {"file", "owner"})
    List<Sticker> findByOwnerIsNullOrOwner(User owner);

    @EntityGraph(attributePaths = {"file", "owner"})
    List<Sticker> findByOwner(User owner);

    @EntityGraph(attributePaths = {"file", "owner"})
    List<Sticker> findByGlobalFlagTrue();
    
    @EntityGraph(attributePaths = {"file", "owner"})
    java.util.Optional<Sticker> findById(Long id);
}


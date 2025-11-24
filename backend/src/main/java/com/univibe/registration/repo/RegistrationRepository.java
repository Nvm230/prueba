package com.univibe.registration.repo;

import com.univibe.registration.model.Registration;
import com.univibe.registration.model.RegistrationStatus;
import com.univibe.user.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);
    List<Registration> findByEventId(Long eventId);
    
    @Query("SELECT r FROM Registration r JOIN FETCH r.event e LEFT JOIN FETCH e.createdBy WHERE r.user.id = :userId")
    List<Registration> findByUserId(@Param("userId") Long userId);
    
    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);

    @Modifying
    @Query("DELETE FROM Registration r WHERE r.event.id = :eventId")
    void deleteByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT DISTINCT r.user.id FROM Registration r WHERE r.event.id IN :eventIds AND r.user.id != :userId")
    List<Long> findUserIdsByEventIdsExcludingUser(@Param("eventIds") List<Long> eventIds, @Param("userId") Long userId);
    
    long countByUser(User user);
}

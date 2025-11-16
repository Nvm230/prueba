package com.univibe.registration.repo;

import com.univibe.registration.model.Registration;
import com.univibe.registration.model.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);
    List<Registration> findByEventId(Long eventId);
    List<Registration> findByUserId(Long userId);
    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);
    
    @Query("SELECT DISTINCT r.user.id FROM Registration r WHERE r.event.id IN :eventIds AND r.user.id != :userId")
    List<Long> findUserIdsByEventIdsExcludingUser(@Param("eventIds") List<Long> eventIds, @Param("userId") Long userId);
}

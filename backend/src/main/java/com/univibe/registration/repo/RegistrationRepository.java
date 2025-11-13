package com.univibe.registration.repo;

import com.univibe.registration.model.Registration;
import com.univibe.registration.model.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);
    List<Registration> findByEventId(Long eventId);
    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);
}

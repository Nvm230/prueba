package com.univibe.call.repo;

import com.univibe.call.model.CallContextType;
import com.univibe.call.model.CallSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CallSessionRepository extends JpaRepository<CallSession, Long> {
    Optional<CallSession> findFirstByContextTypeAndContextIdAndActivoTrue(CallContextType contextType, Long contextId);
    Optional<CallSession> findFirstByContextTypeAndActivoTrueAndCreatedByIdAndContextId(CallContextType contextType, Long createdById, Long contextId);
    List<CallSession> findByContextTypeAndContextIdAndActivoTrue(CallContextType contextType, Long contextId);
}


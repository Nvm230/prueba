package com.univibe.registration.dto;

import com.univibe.registration.model.RegistrationStatus;
import java.time.Instant;

public class CheckInResponse {
    private RegistrationStatus status;
    private Instant checkedInAt;

    public CheckInResponse() {}
    public CheckInResponse(RegistrationStatus status, Instant checkedInAt) {
        this.status = status;
        this.checkedInAt = checkedInAt;
    }

    public RegistrationStatus getStatus() { return status; }
    public void setStatus(RegistrationStatus status) { this.status = status; }
    public Instant getCheckedInAt() { return checkedInAt; }
    public void setCheckedInAt(Instant checkedInAt) { this.checkedInAt = checkedInAt; }
}

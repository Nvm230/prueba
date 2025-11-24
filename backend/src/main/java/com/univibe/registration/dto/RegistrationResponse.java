package com.univibe.registration.dto;

import java.time.Instant;

public class RegistrationResponse {
    private Long registrationId;
    private String qrBase64;
    private String status;
    private Instant checkedInAt;

    public RegistrationResponse() {}

    public RegistrationResponse(Long registrationId, String qrBase64, String status, Instant checkedInAt) {
        this.registrationId = registrationId;
        this.qrBase64 = qrBase64;
        this.status = status;
        this.checkedInAt = checkedInAt;
    }

    public Long getRegistrationId() { return registrationId; }
    public void setRegistrationId(Long registrationId) { this.registrationId = registrationId; }
    public String getQrBase64() { return qrBase64; }
    public void setQrBase64(String qrBase64) { this.qrBase64 = qrBase64; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCheckedInAt() { return checkedInAt; }
    public void setCheckedInAt(Instant checkedInAt) { this.checkedInAt = checkedInAt; }
}

package com.univibe.registration.dto;

public class RegistrationResponse {
    private Long registrationId;
    private String qrBase64;

    public RegistrationResponse() {}
    public RegistrationResponse(Long registrationId, String qrBase64) {
        this.registrationId = registrationId;
        this.qrBase64 = qrBase64;
    }

    public Long getRegistrationId() { return registrationId; }
    public void setRegistrationId(Long registrationId) { this.registrationId = registrationId; }
    public String getQrBase64() { return qrBase64; }
    public void setQrBase64(String qrBase64) { this.qrBase64 = qrBase64; }
}

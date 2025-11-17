package com.univibe.registration.dto;

public class CheckInRequest {
    private String payload; // Para check-in con QR
    private Long eventId; // Para check-in con contraseña
    private String password; // Para check-in con contraseña
    
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

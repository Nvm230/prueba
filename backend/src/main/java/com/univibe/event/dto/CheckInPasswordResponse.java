package com.univibe.event.dto;

public class CheckInPasswordResponse {
    private String password;
    private String qrCodeBase64; // QR code con la contraseña para escanear

    public CheckInPasswordResponse() {}

    public CheckInPasswordResponse(String password, String qrCodeBase64) {
        this.password = password;
        this.qrCodeBase64 = qrCodeBase64;
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getQrCodeBase64() { return qrCodeBase64; }
    public void setQrCodeBase64(String qrCodeBase64) { this.qrCodeBase64 = qrCodeBase64; }
}


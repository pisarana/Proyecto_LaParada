package com.laparada.la_parada_backend.dto;


public class SuccessResponse {
    private String message;
    private String status = "success";
    
    public SuccessResponse(String message) {
        this.message = message;
    }
    
    // Getters y Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

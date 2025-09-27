package com.laparada.la_parada_backend.dto;

public class ErrorResponse {
    private String message;
    private String error = "Bad Request";
    
    public ErrorResponse(String message) {
        this.message = message;
    }
    
    // Getters y Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}

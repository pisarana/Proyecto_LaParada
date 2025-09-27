package com.laparada.la_parada_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateStatusRequest {
    
    @NotBlank(message = "Status es obligatorio")
    private String status;
    
    public UpdateStatusRequest() {}
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

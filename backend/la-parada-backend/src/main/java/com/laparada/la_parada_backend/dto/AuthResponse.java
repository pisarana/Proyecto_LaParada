package com.laparada.la_parada_backend.dto;


import com.laparada.la_parada_backend.entity.User;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private UserDTO user;
    
    // Constructores
    public AuthResponse() {}
    
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters y Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}

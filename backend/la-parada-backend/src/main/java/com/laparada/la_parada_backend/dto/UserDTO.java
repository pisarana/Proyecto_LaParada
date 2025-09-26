package com.laparada.la_parada_backend.dto;


import com.laparada.la_parada_backend.entity.User;

public class UserDTO {
    
    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private Boolean activo;
    
    // Constructor desde Entity
    public UserDTO(User user) {
        this.id = user.getId();
        this.nombre = user.getNombre();
        this.email = user.getEmail();
        this.rol = user.getRol().toString();
        this.activo = user.getActivo();
    }
    
    // Getters y Setters completos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}

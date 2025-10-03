package com.laparada.la_parada_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    
    @NotBlank(message = "Nombre es obligatorio")
    @Size(min = 2, max = 100, message = "Nombre debe tener entre 2 y 100 caracteres")
    private String nombre;
    
    @Email(message = "Email debe ser válido")
    @NotBlank(message = "Email es obligatorio")
    private String email;
    
    @NotBlank(message = "Password es obligatoria")
    @Size(min = 6, message = "Password debe tener al menos 6 caracteres")
    private String password;
    
    // ✅ AGREGAR ESTOS CAMPOS NUEVOS
    @Size(max = 15, message = "Teléfono no puede exceder 15 caracteres")
    private String telefono;
    
    @Size(max = 255, message = "Dirección no puede exceder 255 caracteres")
    private String direccion;
    
    // Constructores, getters y setters
    public RegisterRequest() {}
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    // ✅ NUEVOS GETTERS Y SETTERS
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}

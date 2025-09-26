package com.laparada.la_parada_backend.service;


import com.laparada.la_parada_backend.dto.*;
import com.laparada.la_parada_backend.entity.User;
import com.laparada.la_parada_backend.repository.UserRepository;
import com.laparada.la_parada_backend.security.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JWTUtil jwtUtil;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public AuthResponse login(LoginRequest loginRequest) {
        // Buscar usuario por email
        User user = userRepository.findByEmailAndActivoTrue(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
        
        // Validar contraseña
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        
        // Generar token JWT
        String token = jwtUtil.generateToken(user.getEmail(), user.getRol().toString());
        
        // Crear respuesta
        UserDTO userDTO = new UserDTO(user);
        return new AuthResponse(token, userDTO);
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        // Verificar si el email ya existe
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Crear nuevo usuario
        User newUser = new User();
        newUser.setNombre(registerRequest.getNombre());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRol(User.Role.CLIENTE); // Por defecto es cliente
        newUser.setActivo(true);
        
        // Guardar usuario
        User savedUser = userRepository.save(newUser);
        
        // Generar token JWT
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRol().toString());
        
        // Crear respuesta
        UserDTO userDTO = new UserDTO(savedUser);
        return new AuthResponse(token, userDTO);
    }
}

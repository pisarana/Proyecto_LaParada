package com.laparada.la_parada_backend.service;

import com.laparada.la_parada_backend.dto.*;
import com.laparada.la_parada_backend.entity.User;
import com.laparada.la_parada_backend.repository.UserRepository;
import com.laparada.la_parada_backend.security.JWTUtil;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTUtil jwtUtil;
    @Autowired
    private EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public AuthResponse login(LoginRequest loginRequest) {
        System.out.println("🔍 LOGIN ATTEMPT: " + loginRequest.getEmail());

        // Buscar usuario por email
        User user = userRepository.findByEmailAndActivoTrue(loginRequest.getEmail())
                .orElseThrow(() -> {
                    System.err.println("❌ USER NOT FOUND: " + loginRequest.getEmail());
                    return new RuntimeException("Credenciales inválidas");
                });

        System.out.println("✅ USER FOUND: " + user.getEmail() + " | ROL: " + user.getRol());
        System.out.println("🔑 PASSWORD CHECK...");

        // Validar contraseña
        boolean passwordMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        System.out.println("🔑 PASSWORD MATCH: " + passwordMatch);

        if (!passwordMatch) {
            System.err.println("❌ WRONG PASSWORD for: " + loginRequest.getEmail());
            System.out.println("🔑 EXPECTED HASH: " + user.getPassword());
            throw new RuntimeException("Credenciales inválidas");
        }

        System.out.println("✅ LOGIN SUCCESS: " + user.getEmail());

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
        newUser.setTelefono(registerRequest.getTelefono());
        newUser.setDireccion(registerRequest.getDireccion());
        newUser.setRol(User.Role.CLIENTE);
        newUser.setActivo(true);

        // Guardar usuario
        User savedUser = userRepository.save(newUser);

        // Enviar email de bienvenida
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getNombre());
        } catch (Exception e) {
            System.err.println("⚠️ Error enviando bienvenida: " + e.getMessage());
        }

        // Generar token JWT
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRol().toString());

        // Crear respuesta
        UserDTO userDTO = new UserDTO(savedUser);
        return new AuthResponse(token, userDTO);
    }
}

package com.laparada.la_parada_backend.service;

import com.laparada.la_parada_backend.entity.User;
import com.laparada.la_parada_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Autowired
    private PasswordService passwordService;

    public User createUser(String nombre, String email, String password) {
        if (existsByEmail(email)) {
            throw new RuntimeException("Email ya registrado: " + email);
        }

        // Encriptar contraseña
        String encryptedPassword = passwordService.encryptPassword(password);

        User user = new User(nombre, email, encryptedPassword);
        return save(user);
    }
}

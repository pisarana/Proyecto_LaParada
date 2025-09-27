package com.laparada.la_parada_backend.repository;

import com.laparada.la_parada_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByEmailAndActivoTrue(String email);

    // AGREGAR este método
    Long countByRol(String rol);

}

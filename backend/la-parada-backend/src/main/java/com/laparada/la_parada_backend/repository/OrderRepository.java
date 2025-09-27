package com.laparada.la_parada_backend.repository;

import com.laparada.la_parada_backend.entity.Order;
import com.laparada.la_parada_backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUsuario(User usuario);
    List<Order> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
    List<Order> findByEstadoOrderByFechaCreacionDesc(Order.Estado estado);
    
    @Query("SELECT o FROM Order o WHERE o.fechaCreacion BETWEEN :startDate AND :endDate")
    List<Order> findByFechaCreacionBetween(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
    Long countByEstado(String estado);
    Page<Order> findAllByOrderByFechaCreacionDesc(Pageable pageable);
}

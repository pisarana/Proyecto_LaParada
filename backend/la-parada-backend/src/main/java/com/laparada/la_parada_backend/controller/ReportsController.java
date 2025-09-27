package com.laparada.la_parada_backend.controller;

import com.laparada.la_parada_backend.repository.OrderRepository;
import com.laparada.la_parada_backend.repository.ProductRepository;
import com.laparada.la_parada_backend.repository.UserRepository;

import com.laparada.la_parada_backend.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportsController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Dashboard stats básico
     */
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Contadores básicos
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());

        // Ingresos totales
        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .map(order -> order.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        // Orders por estado usando ENUM
        Long pendingOrders = orderRepository.findAll().stream()
                .filter(order -> Order.Estado.PENDIENTE.equals(order.getEstado()))
                .count();
        stats.put("pendingOrders", pendingOrders);

        Long completedOrders = orderRepository.findAll().stream()
                .filter(order -> Order.Estado.ENTREGADO.equals(order.getEstado()))
                .count();
        stats.put("completedOrders", completedOrders);

        return stats;
    }

    /**
     * Ventas totales
     */
    @GetMapping("/sales")
    public Map<String, Object> getSales() {
        Map<String, Object> sales = new HashMap<>();

        BigDecimal total = orderRepository.findAll().stream()
                .map(order -> order.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        sales.put("totalSales", total);
        sales.put("totalOrders", orderRepository.count());
        sales.put("averageOrder",
                orderRepository.count() > 0 ? total.divide(BigDecimal.valueOf(orderRepository.count()))
                        : BigDecimal.ZERO);

        return sales;
    }

    /**
     * Stats de usuarios
     */
    /**
     * Stats de usuarios - VERSION ARREGLADA
     */
    @GetMapping("/users")
    public Map<String, Object> getUserStats() {
        Map<String, Object> userStats = new HashMap<>();

        userStats.put("totalUsers", userRepository.count());

        // Contar por rol usando ENUM, no String
        Long adminUsers = userRepository.findAll().stream()
                .filter(user -> user.getRol() == User.Role.ADMINISTRADOR)
                .count();
        userStats.put("adminUsers", adminUsers);

        Long clientUsers = userRepository.findAll().stream()
                .filter(user -> user.getRol() == User.Role.CLIENTE)
                .count();
        userStats.put("clientUsers", clientUsers);

        return userStats;
    }

}

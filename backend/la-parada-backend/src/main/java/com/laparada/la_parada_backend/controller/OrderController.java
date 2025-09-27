package com.laparada.la_parada_backend.controller;

import com.laparada.la_parada_backend.dto.*;
import com.laparada.la_parada_backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    /**
     * Crear nueva orden
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        try {
            OrderResponse orderResponse = orderService.createOrder(orderRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Obtener todas las órdenes (Admin) - Paginado
     * GET /api/orders?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<OrderResponse> orders = orderService.getAllOrdersPaginated(
            PageRequest.of(page, size));
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Obtener orden por ID
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            OrderResponse order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Obtener órdenes de un usuario
     * GET /api/orders/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Obtener órdenes por estado
     * GET /api/orders/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Actualizar estado de orden (Admin)
     * PUT /api/orders/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id, 
            @RequestBody UpdateStatusRequest request) {
        try {
            OrderResponse updatedOrder = orderService.updateOrderStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Cancelar orden
     * DELETE /api/orders/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        try {
            orderService.cancelOrder(id);
            return ResponseEntity.ok(new SuccessResponse("Orden cancelada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Obtener resumen de órdenes (Admin)
     * GET /api/orders/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getOrdersSummary() {
        try {
            // Estadísticas básicas de órdenes
            List<OrderResponse> pendientes = orderService.getOrdersByStatus("PENDIENTE");
            List<OrderResponse> confirmadas = orderService.getOrdersByStatus("CONFIRMADO");
            List<OrderResponse> enCamino = orderService.getOrdersByStatus("EN_CAMINO");
            List<OrderResponse> entregadas = orderService.getOrdersByStatus("ENTREGADO");
            
            OrderSummaryResponse summary = new OrderSummaryResponse();
            summary.setPendientes(pendientes.size());
            summary.setConfirmadas(confirmadas.size());
            summary.setEnCamino(enCamino.size());
            summary.setEntregadas(entregadas.size());
            summary.setTotal(pendientes.size() + confirmadas.size() + enCamino.size() + entregadas.size());
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Error al obtener resumen"));
        }
    }
}

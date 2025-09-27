package com.laparada.la_parada_backend.service;

import com.laparada.la_parada_backend.dto.*;
import com.laparada.la_parada_backend.entity.*;
import com.laparada.la_parada_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProductService productService;

    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest) {
        // 1. Validar usuario
        User usuario = userRepository.findById(orderRequest.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Crear orden
        Order order = new Order();
        order.setUsuario(usuario);
        order.setDireccionEntrega(orderRequest.getDireccionEntrega());
        order.setMetodoPago(orderRequest.getMetodoPago());
        order.setTipoEntrega(orderRequest.getTipoEntrega());
        order.setEstado(Order.Estado.PENDIENTE);

        // 3. Procesar items y calcular total
        BigDecimal totalCalculado = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            // Validar producto y stock
            Product producto = productRepository.findById(itemRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + itemRequest.getProductoId()));

            if (!producto.getActivo()) {
                throw new RuntimeException("Producto no disponible: " + producto.getNombre());
            }

            if (producto.getStock() < itemRequest.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre() +
                        " (Disponible: " + producto.getStock() + ", Solicitado: " + itemRequest.getCantidad() + ")");
            }

            // Crear OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setPedido(order);
            orderItem.setProducto(producto);
            orderItem.setCantidad(itemRequest.getCantidad());
            orderItem.setPrecio(producto.getPrecio()); // Precio actual del producto

            // Agregar a la orden
            order.getItems().add(orderItem);

            // Actualizar stock
            producto.setStock(producto.getStock() - itemRequest.getCantidad());
            productRepository.save(producto);

            // Calcular total
            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(itemRequest.getCantidad()));
            totalCalculado = totalCalculado.add(subtotal);
        }

        // 4. Establecer total calculado
        order.setTotal(totalCalculado);

        // 5. Guardar orden
        Order savedOrder = orderRepository.save(order);

        // 6. Enviar boleta por correo automáticamente
        try {
            String customerEmail = usuario.getEmail();
            OrderResponse orderResponse = new OrderResponse(savedOrder);
            emailService.sendOrderReceipt(orderResponse, customerEmail);
        } catch (Exception e) {
            System.err.println("⚠️ Error enviando boleta, pero pedido creado exitosamente: " + e.getMessage());
        }

        return new OrderResponse(savedOrder);

    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByFechaCreacionDesc(null)
                .stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    public Page<OrderResponse> getAllOrdersPaginated(Pageable pageable) {
        return orderRepository.findAllByOrderByFechaCreacionDesc(pageable)
                .map(OrderResponse::new);
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + id));
        return new OrderResponse(order);
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUsuarioIdOrderByFechaCreacionDesc(userId)
                .stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        try {
            Order.Estado estado = Order.Estado.valueOf(newStatus.toUpperCase());
            order.setEstado(estado);
            Order updatedOrder = orderRepository.save(order);

            // Enviar notificación de cambio de estado
            try {
                String customerEmail = updatedOrder.getUsuario().getEmail();
                OrderResponse orderResponse = new OrderResponse(updatedOrder);
                emailService.sendOrderStatusUpdate(orderResponse, customerEmail);
            } catch (Exception e) {
                System.err.println("⚠️ Error enviando notificación de estado: " + e.getMessage());
            }

            return new OrderResponse(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado de orden inválido: " + newStatus);
        }
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        // Solo se pueden cancelar órdenes PENDIENTES
        if (order.getEstado() != Order.Estado.PENDIENTE) {
            throw new RuntimeException("Solo se pueden cancelar órdenes pendientes");
        }

        // Restaurar stock de los productos
        for (OrderItem item : order.getItems()) {
            Product producto = item.getProducto();
            producto.setStock(producto.getStock() + item.getCantidad());
            productRepository.save(producto);
        }

        // Cambiar estado a CANCELADO
        order.setEstado(Order.Estado.CANCELADO);
        orderRepository.save(order);
    }

    public List<OrderResponse> getOrdersByStatus(String status) {
        try {
            Order.Estado estado = Order.Estado.valueOf(status.toUpperCase());
            return orderRepository.findByEstadoOrderByFechaCreacionDesc(estado)
                    .stream()
                    .map(OrderResponse::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado de orden inválido: " + status);
        }
    }
}

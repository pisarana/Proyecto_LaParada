package com.laparada.la_parada_backend.dto;


import com.laparada.la_parada_backend.entity.Order;
import com.laparada.la_parada_backend.entity.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {
    
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private String estado;
    private BigDecimal total;
    private String direccionEntrega;
    private String metodoPago;
    private String tipoEntrega;
    private LocalDateTime fechaCreacion;
    private List<OrderItemResponse> items;
    
    // Constructor desde Entity
    public OrderResponse(Order order) {
        this.id = order.getId();
        this.usuarioId = order.getUsuario().getId();
        this.usuarioNombre = order.getUsuario().getNombre();
        this.estado = order.getEstado().toString();
        this.total = order.getTotal();
        this.direccionEntrega = order.getDireccionEntrega();
        this.metodoPago = order.getMetodoPago();
        this.tipoEntrega = order.getTipoEntrega();
        this.fechaCreacion = order.getFechaCreacion();
        this.items = order.getItems().stream()
                .map(OrderItemResponse::new)
                .collect(Collectors.toList());
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    
    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }
    
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    
    public String getTipoEntrega() { return tipoEntrega; }
    public void setTipoEntrega(String tipoEntrega) { this.tipoEntrega = tipoEntrega; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }
}

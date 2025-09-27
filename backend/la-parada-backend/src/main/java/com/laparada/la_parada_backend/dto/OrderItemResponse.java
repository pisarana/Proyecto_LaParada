package com.laparada.la_parada_backend.dto;

import com.laparada.la_parada_backend.entity.OrderItem;

import java.math.BigDecimal;

public class OrderItemResponse {
    
    private Long id;
    private Long productoId;
    private String productoNombre;
    private Integer cantidad;
    private BigDecimal precio;
    private BigDecimal subtotal;
    
    // Constructor desde Entity
    public OrderItemResponse(OrderItem item) {
        this.id = item.getId();
        this.productoId = item.getProducto().getId();
        this.productoNombre = item.getProducto().getNombre();
        this.cantidad = item.getCantidad();
        this.precio = item.getPrecio();
        this.subtotal = item.getPrecio().multiply(BigDecimal.valueOf(item.getCantidad()));
    }
    
    // Getters y Setters completos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    
    public String getProductoNombre() { return productoNombre; }
    public void setProductoNombre(String productoNombre) { this.productoNombre = productoNombre; }
    
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}

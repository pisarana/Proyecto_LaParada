package com.laparada.la_parada_backend.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OrderItemRequest {
    
    @NotNull(message = "Producto ID es obligatorio")
    private Long productoId;
    
    @Min(value = 1, message = "Cantidad debe ser mayor a 0")
    @NotNull(message = "Cantidad es obligatoria")
    private Integer cantidad;
    
    // Constructores
    public OrderItemRequest() {}
    
    public OrderItemRequest(Long productoId, Integer cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
    }
    
    // Getters y Setters
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}

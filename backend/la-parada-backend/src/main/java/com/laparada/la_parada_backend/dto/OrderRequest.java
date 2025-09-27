package com.laparada.la_parada_backend.dto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class OrderRequest {
    
    @NotNull(message = "Usuario ID es obligatorio")
    private Long usuarioId;
    
    @NotEmpty(message = "El pedido debe tener al menos un item")
    private List<OrderItemRequest> items;
    
    private String direccionEntrega;
    
    private String metodoPago;
    
    private String tipoEntrega = "DELIVERY";
    
    @DecimalMin(value = "0.0", message = "El total debe ser mayor o igual a 0")
    private BigDecimal total;
    
    // Constructores
    public OrderRequest() {}
    
    // Getters y Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    
    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }
    
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    
    public String getTipoEntrega() { return tipoEntrega; }
    public void setTipoEntrega(String tipoEntrega) { this.tipoEntrega = tipoEntrega; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
}

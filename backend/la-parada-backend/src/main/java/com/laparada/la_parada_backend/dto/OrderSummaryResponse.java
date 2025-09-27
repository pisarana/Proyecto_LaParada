package com.laparada.la_parada_backend.dto;


public class OrderSummaryResponse {
    private int pendientes;
    private int confirmadas;
    private int enCamino;
    private int entregadas;
    private int total;
    
    // Getters y Setters
    public int getPendientes() { return pendientes; }
    public void setPendientes(int pendientes) { this.pendientes = pendientes; }
    
    public int getConfirmadas() { return confirmadas; }
    public void setConfirmadas(int confirmadas) { this.confirmadas = confirmadas; }
    
    public int getEnCamino() { return enCamino; }
    public void setEnCamino(int enCamino) { this.enCamino = enCamino; }
    
    public int getEntregadas() { return entregadas; }
    public void setEntregadas(int entregadas) { this.entregadas = entregadas; }
    
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
}

package com.laparada.la_parada_backend.service;

import com.laparada.la_parada_backend.entity.Product;
import com.laparada.la_parada_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findByActivoTrue();
    }
    
    public List<Product> getFeaturedProducts() {
        return productRepository.findByDestacadoTrueAndActivoTrue();
    }
    
    public Product findById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }
    
    public List<Product> findByCategory(String categoria) {
        return productRepository.findByCategoriaAndActivoTrue(categoria);
    }
    
    public Page<Product> getFilteredProducts(String categoria, BigDecimal minPrice, 
                                           BigDecimal maxPrice, String search, Pageable pageable) {
        return productRepository.findFilteredProducts(categoria, minPrice, maxPrice, search, pageable);
    }
    
    public Product save(Product product) {
        return productRepository.save(product);
    }
    
    public void deleteById(Long id) {
        Product product = findById(id);
        product.setActivo(false); // Soft delete
        productRepository.save(product);
    }
}

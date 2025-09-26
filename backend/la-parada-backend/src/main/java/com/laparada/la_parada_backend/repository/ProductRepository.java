package com.laparada.la_parada_backend.repository;


import com.laparada.la_parada_backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByActivoTrue();
    List<Product> findByDestacadoTrueAndActivoTrue();
    List<Product> findByCategoriaAndActivoTrue(String categoria);
    
    @Query("SELECT p FROM Product p WHERE p.activo = true AND " +
           "(:categoria IS NULL OR p.categoria = :categoria) AND " +
           "(:minPrice IS NULL OR p.precio >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.precio <= :maxPrice) AND " +
           "(:search IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findFilteredProducts(
        @Param("categoria") String categoria,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("search") String search,
        Pageable pageable
    );
}

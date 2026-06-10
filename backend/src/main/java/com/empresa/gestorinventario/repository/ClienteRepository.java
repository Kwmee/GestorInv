package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByNifCif(String nifCif);

    @Query("""
        SELECT c FROM Cliente c
        WHERE c.activo = true
          AND (:busqueda IS NULL OR LOWER(c.razonSocial) LIKE LOWER(CONCAT('%', :busqueda, '%'))
               OR LOWER(c.nifCif) LIKE LOWER(CONCAT('%', :busqueda, '%')))
        """)
    Page<Cliente> buscarActivos(@Param("busqueda") String busqueda, Pageable pageable);
}

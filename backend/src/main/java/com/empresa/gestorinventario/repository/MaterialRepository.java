package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.Material;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    Optional<Material> findByNumeroSerie(String numeroSerie);

    boolean existsByNumeroSerie(String numeroSerie);

    @Query("""
        SELECT m FROM Material m
        WHERE m.activo = true
          AND (:estado IS NULL OR m.estado = :estado)
          AND (:categoriaId IS NULL OR m.categoria.id = :categoriaId)
          AND (:busqueda IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%'))
               OR LOWER(m.marca) LIKE LOWER(CONCAT('%', :busqueda, '%'))
               OR LOWER(m.modelo) LIKE LOWER(CONCAT('%', :busqueda, '%')))
        """)
    Page<Material> buscarConFiltros(
        @Param("estado") EstadoMaterial estado,
        @Param("categoriaId") Long categoriaId,
        @Param("busqueda") String busqueda,
        Pageable pageable
    );

    long countByEstado(EstadoMaterial estado);

    long countByActivoTrue();
}

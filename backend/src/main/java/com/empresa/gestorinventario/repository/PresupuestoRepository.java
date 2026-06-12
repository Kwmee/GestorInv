// repository/PresupuestoRepository.java
package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.Presupuesto;
import com.empresa.gestorinventario.model.enums.EstadoPresupuesto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {

    Page<Presupuesto> findByClienteIdOrDescripcionContainingIgnoreCaseOrderByFechaEmisionDesc(
            Long clienteId, String desc, Pageable pageable);

    Optional<Presupuesto> findByNumero(String numero);

    boolean existsByNumero(String numero);

    long countByEstado(EstadoPresupuesto estado);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(p.numero, 9) AS integer)), 0) FROM Presupuesto p WHERE p.numero LIKE CONCAT(:year, '-%')")
    Integer findMaxNumeroByYear(@Param("year") String year);
}

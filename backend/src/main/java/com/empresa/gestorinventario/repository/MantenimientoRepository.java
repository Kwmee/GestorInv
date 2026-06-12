// repository/MantenimientoRepository.java
package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.Mantenimiento;
import com.empresa.gestorinventario.model.enums.EstadoMantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {

    List<Mantenimiento> findByMaterialIdOrderByFechaEntradaDesc(Long materialId);

    List<Mantenimiento> findByEstadoNot(EstadoMantenimiento estado);

    long countByEstado(EstadoMantenimiento estado);
}

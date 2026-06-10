package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {

    List<HistorialEstado> findByMaterialIdOrderByFechaDesc(Long materialId);
}

package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.LineaEvento;
import com.empresa.gestorinventario.model.enums.EstadoDevolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LineaEventoRepository extends JpaRepository<LineaEvento, Long> {

    List<LineaEvento> findByEventoId(Long eventoId);

    @Query("SELECT COUNT(l) FROM LineaEvento l WHERE l.evento.id = :eventoId AND l.estadoDevolucion = :estado")
    long contarPorEventoYEstado(@Param("eventoId") Long eventoId, @Param("estado") EstadoDevolucion estado);

    @Query("SELECT COUNT(l) FROM LineaEvento l WHERE l.estadoDevolucion = 'PENDIENTE'")
    long contarTodosPendientes();
}

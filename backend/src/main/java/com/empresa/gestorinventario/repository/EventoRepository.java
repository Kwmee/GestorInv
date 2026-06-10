package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.Evento;
import com.empresa.gestorinventario.model.enums.EstadoEvento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    List<Evento> findByEstado(EstadoEvento estado);

    long countByEstado(EstadoEvento estado);

    @Query("""
        SELECT e FROM Evento e
        WHERE (:estado IS NULL OR e.estado = :estado)
          AND (:clienteId IS NULL OR e.cliente.id = :clienteId)
          AND (:fechaDesde IS NULL OR e.fechaInicio >= :fechaDesde)
        ORDER BY e.fechaInicio DESC
        """)
    Page<Evento> buscarConFiltros(
        @Param("estado") EstadoEvento estado,
        @Param("clienteId") Long clienteId,
        @Param("fechaDesde") LocalDateTime fechaDesde,
        Pageable pageable
    );

    List<Evento> findByClienteIdOrderByFechaInicioDesc(Long clienteId);
}

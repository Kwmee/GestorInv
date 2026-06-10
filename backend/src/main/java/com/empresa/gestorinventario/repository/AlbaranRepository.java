package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.Albaran;
import com.empresa.gestorinventario.model.enums.TipoAlbaran;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AlbaranRepository extends JpaRepository<Albaran, Long> {

    List<Albaran> findByEventoIdOrderByFechaEmisionDesc(Long eventoId);

    Optional<Albaran> findByNumero(String numero);

    @Query("""
        SELECT a FROM Albaran a
        WHERE (:tipo IS NULL OR a.tipo = :tipo)
          AND (:eventoId IS NULL OR a.evento.id = :eventoId)
          AND (:fechaDesde IS NULL OR a.fechaEmision >= :fechaDesde)
        ORDER BY a.fechaEmision DESC
        """)
    Page<Albaran> buscarConFiltros(
        @Param("tipo") TipoAlbaran tipo,
        @Param("eventoId") Long eventoId,
        @Param("fechaDesde") LocalDateTime fechaDesde,
        Pageable pageable
    );

    @Query("SELECT MAX(a.numero) FROM Albaran a WHERE a.tipo = :tipo AND a.numero LIKE :prefijo%")
    Optional<String> findUltimoNumero(@Param("tipo") TipoAlbaran tipo, @Param("prefijo") String prefijo);
}

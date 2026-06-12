package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {
    List<ChecklistItem> findByEventoIdOrderByMaterialNombreAsc(Long eventoId);
    void deleteByEventoId(Long eventoId);
}

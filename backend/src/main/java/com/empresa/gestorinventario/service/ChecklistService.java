package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.NegocioException;
import com.empresa.gestorinventario.exception.RecursoNoEncontradoException;
import com.empresa.gestorinventario.model.dto.request.ChecklistItemRequest;
import com.empresa.gestorinventario.model.dto.response.ChecklistItemResponse;
import com.empresa.gestorinventario.model.entity.ChecklistItem;
import com.empresa.gestorinventario.model.entity.Evento;
import com.empresa.gestorinventario.model.enums.EstadoChecklistItem;
import com.empresa.gestorinventario.model.enums.EstadoEvento;
import com.empresa.gestorinventario.repository.ChecklistItemRepository;
import com.empresa.gestorinventario.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChecklistService {

    private final ChecklistItemRepository checklistRepository;
    private final EventoRepository eventoRepository;

    public List<ChecklistItemResponse> obtenerChecklist(Long eventoId) {
        return checklistRepository.findByEventoIdOrderByMaterialNombreAsc(eventoId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public List<ChecklistItemResponse> iniciarCarga(Long eventoId) {
        Evento evento = obtenerEvento(eventoId);

        if (evento.getEstado() != EstadoEvento.PLANIFICADO) {
            throw new NegocioException("Solo se puede iniciar la carga desde estado PLANIFICADO");
        }
        if (evento.getLineas().isEmpty()) {
            throw new NegocioException("El evento no tiene material asignado");
        }

        checklistRepository.deleteByEventoId(eventoId);

        List<ChecklistItem> items = evento.getLineas().stream()
                .map(linea -> ChecklistItem.builder()
                        .evento(evento)
                        .material(linea.getMaterial())
                        .cantidadPlanificada(linea.getCantidad())
                        .estado(EstadoChecklistItem.PENDIENTE)
                        .build())
                .toList();

        checklistRepository.saveAll(items);

        evento.setEstado(EstadoEvento.EN_CARGA);
        eventoRepository.save(evento);

        return checklistRepository.findByEventoIdOrderByMaterialNombreAsc(eventoId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ChecklistItemResponse marcarItem(Long eventoId, Long itemId, ChecklistItemRequest request) {
        Evento evento = obtenerEvento(eventoId);

        if (evento.getEstado() != EstadoEvento.EN_CARGA) {
            throw new NegocioException("El checklist solo es editable en estado EN_CARGA");
        }

        ChecklistItem item = checklistRepository.findById(itemId)
                .orElseThrow(() -> new RecursoNoEncontradoException("ChecklistItem", itemId));

        if (!item.getEvento().getId().equals(eventoId)) {
            throw new NegocioException("El item no pertenece a este evento");
        }

        item.setEstado(request.getEstado());
        item.setCantidadCargada(request.getCantidadCargada());
        item.setNotas(request.getNotas());

        if (request.getEstado() != EstadoChecklistItem.PENDIENTE) {
            item.setConfirmadoEn(LocalDateTime.now());
        } else {
            item.setConfirmadoEn(null);
        }

        return toResponse(checklistRepository.save(item));
    }

    private Evento obtenerEvento(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Evento", id));
    }

    private ChecklistItemResponse toResponse(ChecklistItem item) {
        return ChecklistItemResponse.builder()
                .id(item.getId())
                .materialId(item.getMaterial().getId())
                .materialNombre(item.getMaterial().getNombre())
                .materialNumeroSerie(item.getMaterial().getNumeroSerie())
                .materialCategoria(item.getMaterial().getCategoria() != null
                        ? item.getMaterial().getCategoria().getNombre() : null)
                .cantidadPlanificada(item.getCantidadPlanificada())
                .cantidadCargada(item.getCantidadCargada())
                .estado(item.getEstado())
                .notas(item.getNotas())
                .confirmadoEn(item.getConfirmadoEn())
                .build();
    }
}

package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.model.dto.response.DashboardResponse;
import com.empresa.gestorinventario.model.enums.EstadoEvento;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import com.empresa.gestorinventario.repository.EventoRepository;
import com.empresa.gestorinventario.repository.LineaEventoRepository;
import com.empresa.gestorinventario.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final MaterialRepository materialRepository;
    private final EventoRepository eventoRepository;
    private final LineaEventoRepository lineaEventoRepository;

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public DashboardResponse obtenerResumen() {
        long disponible  = materialRepository.countByEstado(EstadoMaterial.DISPONIBLE);
        long enEvento    = materialRepository.countByEstado(EstadoMaterial.EN_EVENTO);
        long enReparacion = materialRepository.countByEstado(EstadoMaterial.EN_REPARACION);
        long baja        = materialRepository.countByEstado(EstadoMaterial.BAJA);
        long total       = disponible + enEvento + enReparacion + baja;

        long eventosActivos           = eventoRepository.countByEstado(EstadoEvento.ACTIVO);
        long materialPendienteTotal   = lineaEventoRepository.contarTodosPendientes();

        List<DashboardResponse.EventoActivoInfo> detalle = eventoRepository
            .findByEstado(EstadoEvento.ACTIVO).stream()
            .map(e -> {
                long pendientes = e.getLineas().stream()
                    .filter(l -> l.getEstadoDevolucion().name().equals("PENDIENTE"))
                    .count();

                return DashboardResponse.EventoActivoInfo.builder()
                    .id(e.getId())
                    .nombre(e.getNombre())
                    .cliente(e.getCliente().getRazonSocial())
                    .fechaInicio(e.getFechaInicio().format(FORMATO_FECHA))
                    .materialPendiente(pendientes)
                    .build();
            })
            .toList();

        LocalDateTime ahora = LocalDateTime.now();
        List<DashboardResponse.AlertaDevolucion> alertas = eventoRepository
            .findByEstado(EstadoEvento.DEVOLVIENDO).stream()
            .map(e -> {
                long pendientes = e.getLineas().stream()
                    .filter(l -> l.getEstadoDevolucion().name().equals("PENDIENTE"))
                    .count();
                long diasRetraso = e.getFechaFin() != null
                    ? Math.max(0, ChronoUnit.DAYS.between(e.getFechaFin(), ahora))
                    : 0;
                return DashboardResponse.AlertaDevolucion.builder()
                    .id(e.getId())
                    .nombre(e.getNombre())
                    .cliente(e.getCliente().getRazonSocial())
                    .fechaFin(e.getFechaFin() != null ? e.getFechaFin().format(FORMATO_FECHA) : "—")
                    .diasRetraso(diasRetraso)
                    .materialPendiente(pendientes)
                    .build();
            })
            .toList();

        return DashboardResponse.builder()
            .totalMaterial(total)
            .disponible(disponible)
            .enEvento(enEvento)
            .enReparacion(enReparacion)
            .baja(baja)
            .eventosActivos(eventosActivos)
            .materialPendienteDevolucion(materialPendienteTotal)
            .eventosActivosDetalle(detalle)
            .alertasDevolucion(alertas)
            .build();
    }
}

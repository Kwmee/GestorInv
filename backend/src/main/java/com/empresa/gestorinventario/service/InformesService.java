// service/InformesService.java
package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.model.dto.response.InformesResponse;
import com.empresa.gestorinventario.model.entity.Evento;
import com.empresa.gestorinventario.model.entity.LineaEvento;
import com.empresa.gestorinventario.model.entity.Material;
import com.empresa.gestorinventario.model.enums.EstadoEvento;
import com.empresa.gestorinventario.model.enums.EstadoMantenimiento;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import com.empresa.gestorinventario.repository.EventoRepository;
import com.empresa.gestorinventario.repository.LineaEventoRepository;
import com.empresa.gestorinventario.repository.MantenimientoRepository;
import com.empresa.gestorinventario.repository.MaterialRepository;
import com.empresa.gestorinventario.repository.PresupuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InformesService {

    private final MaterialRepository materialRepository;
    private final EventoRepository eventoRepository;
    private final MantenimientoRepository mantenimientoRepository;
    private final PresupuestoRepository presupuestoRepository;
    private final LineaEventoRepository lineaEventoRepository;

    private static final DateTimeFormatter FORMATO_MES = DateTimeFormatter.ofPattern("MM/yyyy");

    public InformesResponse obtenerInformes() {
        return InformesResponse.builder()
                .resumenMaterial(buildResumenMaterial())
                .materialPorCategoria(buildMaterialPorCategoria())
                .eventosPorMes(buildEventosPorMes())
                .top5MaterialUsado(buildTop5MaterialUsado())
                .resumenEventos(buildResumenEventos())
                .resumenMantenimiento(buildResumenMantenimiento())
                .build();
    }

    private InformesResponse.ResumenMaterial buildResumenMaterial() {
        long disponible   = materialRepository.countByEstado(EstadoMaterial.DISPONIBLE);
        long enEvento     = materialRepository.countByEstado(EstadoMaterial.EN_EVENTO);
        long enReparacion = materialRepository.countByEstado(EstadoMaterial.EN_REPARACION);
        long baja         = materialRepository.countByEstado(EstadoMaterial.BAJA);
        long total        = disponible + enEvento + enReparacion + baja;

        BigDecimal valorTotal = materialRepository.findAll().stream()
                .filter(m -> m.getValorUnitario() != null && Boolean.TRUE.equals(m.getActivo()))
                .map(m -> m.getValorUnitario().multiply(BigDecimal.valueOf(m.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return InformesResponse.ResumenMaterial.builder()
                .totalItems(total)
                .disponible(disponible)
                .enEvento(enEvento)
                .enReparacion(enReparacion)
                .baja(baja)
                .valorTotal(valorTotal)
                .build();
    }

    private List<InformesResponse.CategoriaStats> buildMaterialPorCategoria() {
        List<Material> todos = materialRepository.findAll();

        Map<String, List<Material>> porCategoria = todos.stream()
                .filter(m -> Boolean.TRUE.equals(m.getActivo()) && m.getCategoria() != null)
                .collect(Collectors.groupingBy(m -> m.getCategoria().getNombre()));

        return porCategoria.entrySet().stream()
                .map(entry -> {
                    long disponible = entry.getValue().stream()
                            .filter(m -> m.getEstado() == EstadoMaterial.DISPONIBLE)
                            .count();
                    return InformesResponse.CategoriaStats.builder()
                            .categoria(entry.getKey())
                            .total(entry.getValue().size())
                            .disponible(disponible)
                            .build();
                })
                .sorted(Comparator.comparing(InformesResponse.CategoriaStats::getCategoria))
                .toList();
    }

    private List<InformesResponse.MesStats> buildEventosPorMes() {
        int anioActual = LocalDateTime.now().getYear();
        List<Evento> eventos = eventoRepository.findAll().stream()
                .filter(e -> e.getFechaInicio().getYear() == anioActual)
                .toList();

        Map<String, List<Evento>> porMes = eventos.stream()
                .collect(Collectors.groupingBy(e -> e.getFechaInicio().format(FORMATO_MES)));

        return porMes.entrySet().stream()
                .map(entry -> {
                    long finalizados = entry.getValue().stream()
                            .filter(e -> e.getEstado() == EstadoEvento.FINALIZADO)
                            .count();
                    return InformesResponse.MesStats.builder()
                            .mes(entry.getKey())
                            .total(entry.getValue().size())
                            .finalizados(finalizados)
                            .build();
                })
                .sorted(Comparator.comparing(InformesResponse.MesStats::getMes))
                .toList();
    }

    private List<InformesResponse.MaterialUsado> buildTop5MaterialUsado() {
        List<LineaEvento> todasLineas = lineaEventoRepository.findAll();

        Map<Long, List<LineaEvento>> porMaterial = todasLineas.stream()
                .collect(Collectors.groupingBy(l -> l.getMaterial().getId()));

        return porMaterial.entrySet().stream()
                .map(entry -> {
                    LineaEvento primera = entry.getValue().get(0);
                    Material mat = primera.getMaterial();
                    return InformesResponse.MaterialUsado.builder()
                            .nombre(mat.getNombre())
                            .categoria(mat.getCategoria().getNombre())
                            .vecesEnEventos(entry.getValue().size())
                            .build();
                })
                .sorted(Comparator.comparingLong(InformesResponse.MaterialUsado::getVecesEnEventos).reversed())
                .limit(5)
                .toList();
    }

    private InformesResponse.ResumenEventos buildResumenEventos() {
        long planificados = eventoRepository.countByEstado(EstadoEvento.PLANIFICADO);
        long activos      = eventoRepository.countByEstado(EstadoEvento.ACTIVO);
        long finalizados  = eventoRepository.countByEstado(EstadoEvento.FINALIZADO);
        long cancelados   = eventoRepository.countByEstado(EstadoEvento.CANCELADO);
        long total        = planificados + activos + finalizados + cancelados
                + eventoRepository.countByEstado(EstadoEvento.EN_CARGA)
                + eventoRepository.countByEstado(EstadoEvento.DEVOLVIENDO);

        return InformesResponse.ResumenEventos.builder()
                .total(total)
                .planificados(planificados)
                .activos(activos)
                .finalizados(finalizados)
                .cancelados(cancelados)
                .build();
    }

    private InformesResponse.ResumenMantenimiento buildResumenMantenimiento() {
        long enRevision   = mantenimientoRepository.countByEstado(EstadoMantenimiento.EN_REVISION);
        long reparando    = mantenimientoRepository.countByEstado(EstadoMantenimiento.REPARANDO);
        long reparados    = mantenimientoRepository.countByEstado(EstadoMantenimiento.REPARADO);
        long irreparables = mantenimientoRepository.countByEstado(EstadoMantenimiento.IRREPARABLE);

        return InformesResponse.ResumenMantenimiento.builder()
                .enRevision(enRevision)
                .reparando(reparando)
                .reparados(reparados)
                .irreparables(irreparables)
                .build();
    }
}

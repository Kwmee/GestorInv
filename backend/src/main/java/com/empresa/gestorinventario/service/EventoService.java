package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.MaterialNoDisponibleException;
import com.empresa.gestorinventario.exception.NegocioException;
import com.empresa.gestorinventario.exception.RecursoNoEncontradoException;
import com.empresa.gestorinventario.model.dto.request.DevolucionRequest;
import com.empresa.gestorinventario.model.dto.request.EventoRequest;
import com.empresa.gestorinventario.model.dto.response.AlbaranResponse;
import com.empresa.gestorinventario.model.dto.response.EventoResponse;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.entity.*;
import com.empresa.gestorinventario.model.enums.EstadoDevolucion;
import com.empresa.gestorinventario.model.enums.EstadoEvento;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import com.empresa.gestorinventario.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventoService {

    private final EventoRepository eventoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final MaterialService materialService;
    private final AlbaranService albaranService;

    public PaginaResponse<EventoResponse> listar(EstadoEvento estado, Long clienteId,
                                                  LocalDateTime fechaDesde, Pageable pageable) {
        Page<Evento> pagina = eventoRepository.buscarConFiltros(estado, clienteId, fechaDesde, pageable);

        return PaginaResponse.<EventoResponse>builder()
            .contenido(pagina.getContent().stream().map(this::toResponse).toList())
            .paginaActual(pagina.getNumber())
            .totalPaginas(pagina.getTotalPages())
            .totalElementos(pagina.getTotalElements())
            .primera(pagina.isFirst())
            .ultima(pagina.isLast())
            .build();
    }

    public EventoResponse obtenerPorId(Long id) {
        return toResponse(obtenerEntidad(id));
    }

    @Transactional
    public EventoResponse crear(EventoRequest request) {
        Cliente cliente = clienteRepository.findById(request.getClienteId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", request.getClienteId()));

        Usuario tecnico = null;
        if (request.getTecnicoResponsableId() != null) {
            tecnico = usuarioRepository.findById(request.getTecnicoResponsableId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", request.getTecnicoResponsableId()));
        }

        Evento evento = Evento.builder()
            .cliente(cliente)
            .tecnicoResponsable(tecnico)
            .nombre(request.getNombre())
            .descripcion(request.getDescripcion())
            .lugar(request.getLugar())
            .fechaInicio(request.getFechaInicio())
            .fechaFin(request.getFechaFin())
            .observaciones(request.getObservaciones())
            .build();

        if (request.getLineas() != null && !request.getLineas().isEmpty()) {
            agregarLineas(evento, request.getLineas());
        }

        return toResponse(eventoRepository.save(evento));
    }

    @Transactional
    public EventoResponse actualizar(Long id, EventoRequest request) {
        Evento evento = obtenerEntidad(id);

        if (evento.getEstado() == EstadoEvento.FINALIZADO || evento.getEstado() == EstadoEvento.CANCELADO) {
            throw new NegocioException("No se puede modificar un evento en estado " + evento.getEstado());
        }

        Cliente cliente = clienteRepository.findById(request.getClienteId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", request.getClienteId()));

        evento.setCliente(cliente);
        evento.setNombre(request.getNombre());
        evento.setDescripcion(request.getDescripcion());
        evento.setLugar(request.getLugar());
        evento.setFechaInicio(request.getFechaInicio());
        evento.setFechaFin(request.getFechaFin());
        evento.setObservaciones(request.getObservaciones());

        return toResponse(eventoRepository.save(evento));
    }

    @Transactional
    public EventoResponse agregarMaterial(Long eventoId, List<EventoRequest.LineaMaterialRequest> lineasRequest) {
        Evento evento = obtenerEntidad(eventoId);

        if (evento.getEstado() == EstadoEvento.FINALIZADO || evento.getEstado() == EstadoEvento.CANCELADO) {
            throw new NegocioException("No se puede añadir material a un evento en estado " + evento.getEstado());
        }

        agregarLineas(evento, lineasRequest);
        return toResponse(eventoRepository.save(evento));
    }

    @Transactional
    public void quitarMaterial(Long eventoId, Long materialId) {
        Evento evento = obtenerEntidad(eventoId);

        if (evento.getEstado() != EstadoEvento.PLANIFICADO) {
            throw new NegocioException("Solo se puede quitar material de eventos en estado PLANIFICADO");
        }

        LineaEvento linea = evento.getLineas().stream()
            .filter(l -> l.getMaterial().getId().equals(materialId))
            .findFirst()
            .orElseThrow(() -> new NegocioException("El material no está asignado a este evento"));

        material_devolverADisponible(linea.getMaterial());
        evento.getLineas().remove(linea);
        eventoRepository.save(evento);
    }

    @Transactional
    public AlbaranResponse confirmarSalida(Long eventoId) {
        Evento evento = obtenerEntidad(eventoId);

        if (evento.getLineas().isEmpty()) {
            throw new NegocioException("El evento no tiene material asignado");
        }
        if (evento.getEstado() == EstadoEvento.ACTIVO) {
            throw new NegocioException("El albarán de salida ya fue generado para este evento");
        }
        if (evento.getEstado() != EstadoEvento.PLANIFICADO) {
            throw new NegocioException("No se puede confirmar la salida de un evento en estado " + evento.getEstado());
        }

        Usuario usuarioActual = obtenerUsuarioActual();

        for (LineaEvento linea : evento.getLineas()) {
            materialService.cambiarEstado(linea.getMaterial(), EstadoMaterial.EN_EVENTO,
                usuarioActual, "Asignado al evento: " + evento.getNombre());
        }

        evento.setEstado(EstadoEvento.ACTIVO);
        eventoRepository.save(evento);

        return albaranService.generarAlbaranSalida(evento);
    }

    @Transactional
    public AlbaranResponse registrarDevolucion(Long eventoId, DevolucionRequest request) {
        Evento evento = obtenerEntidad(eventoId);

        if (evento.getEstado() != EstadoEvento.ACTIVO) {
            throw new NegocioException("Solo se puede registrar devolución en eventos ACTIVOS");
        }

        Usuario usuarioActual = obtenerUsuarioActual();

        for (DevolucionRequest.LineaDevolucionRequest lineaReq : request.getLineas()) {
            LineaEvento linea = evento.getLineas().stream()
                .filter(l -> l.getMaterial().getId().equals(lineaReq.getMaterialId()))
                .findFirst()
                .orElseThrow(() -> new NegocioException("Material no encontrado en este evento: " + lineaReq.getMaterialId()));

            linea.setEstadoDevolucion(lineaReq.getEstadoDevolucion());
            linea.setObservaciones(lineaReq.getObservaciones());

            EstadoMaterial nuevoEstado = switch (lineaReq.getEstadoDevolucion()) {
                case OK -> EstadoMaterial.DISPONIBLE;
                case CON_INCIDENCIA -> EstadoMaterial.EN_REPARACION;
                case NO_DEVUELTO -> EstadoMaterial.BAJA;
                default -> throw new NegocioException("Estado de devolución no válido");
            };

            materialService.cambiarEstado(linea.getMaterial(), nuevoEstado,
                usuarioActual, lineaReq.getObservaciones());
        }

        boolean todoGestionado = evento.getLineas().stream()
            .allMatch(l -> l.getEstadoDevolucion() != EstadoDevolucion.PENDIENTE);

        if (todoGestionado) {
            evento.setEstado(EstadoEvento.FINALIZADO);
        }

        eventoRepository.save(evento);

        return albaranService.generarAlbaranDevolucion(evento, request.getLineas());
    }

    private void agregarLineas(Evento evento, List<EventoRequest.LineaMaterialRequest> lineasRequest) {
        for (EventoRequest.LineaMaterialRequest lineaReq : lineasRequest) {
            Material material = materialService.obtenerEntidad(lineaReq.getMaterialId());

            if (material.getEstado() != EstadoMaterial.DISPONIBLE) {
                throw new MaterialNoDisponibleException(material.getNombre(), material.getEstado().name());
            }

            boolean yaAsignado = evento.getLineas().stream()
                .anyMatch(l -> l.getMaterial().getId().equals(material.getId()));

            if (yaAsignado) {
                throw new NegocioException("El material '" + material.getNombre() + "' ya está asignado a este evento");
            }

            LineaEvento linea = LineaEvento.builder()
                .evento(evento)
                .material(material)
                .cantidad(lineaReq.getCantidad())
                .observaciones(lineaReq.getObservaciones())
                .build();

            evento.getLineas().add(linea);
        }
    }

    private void material_devolverADisponible(Material material) {
        if (material.getEstado() == EstadoMaterial.EN_EVENTO) {
            material.setEstado(EstadoMaterial.DISPONIBLE);
        }
    }

    private Usuario obtenerUsuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    public Evento obtenerEntidad(Long id) {
        return eventoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Evento", id));
    }

    EventoResponse toResponse(Evento e) {
        List<EventoResponse.LineaEventoInfo> lineas = e.getLineas() == null ? new ArrayList<>() :
            e.getLineas().stream()
                .map(l -> EventoResponse.LineaEventoInfo.builder()
                    .id(l.getId())
                    .materialId(l.getMaterial().getId())
                    .materialNombre(l.getMaterial().getNombre())
                    .materialNumeroSerie(l.getMaterial().getNumeroSerie())
                    .cantidad(l.getCantidad())
                    .estadoDevolucion(l.getEstadoDevolucion())
                    .observaciones(l.getObservaciones())
                    .build())
                .toList();

        return EventoResponse.builder()
            .id(e.getId())
            .cliente(EventoResponse.ClienteInfo.builder()
                .id(e.getCliente().getId())
                .razonSocial(e.getCliente().getRazonSocial())
                .nifCif(e.getCliente().getNifCif())
                .telefono(e.getCliente().getTelefono())
                .email(e.getCliente().getEmail())
                .direccion(e.getCliente().getDireccion())
                .build())
            .tecnicoResponsable(e.getTecnicoResponsable() == null ? null :
                EventoResponse.UsuarioInfo.builder()
                    .id(e.getTecnicoResponsable().getId())
                    .nombre(e.getTecnicoResponsable().getNombre())
                    .build())
            .nombre(e.getNombre())
            .descripcion(e.getDescripcion())
            .lugar(e.getLugar())
            .fechaInicio(e.getFechaInicio())
            .fechaFin(e.getFechaFin())
            .estado(e.getEstado())
            .observaciones(e.getObservaciones())
            .lineas(lineas)
            .creadoEn(e.getCreadoEn())
            .build();
    }
}

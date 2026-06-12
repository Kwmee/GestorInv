// service/PresupuestoService.java
package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.NegocioException;
import com.empresa.gestorinventario.exception.RecursoNoEncontradoException;
import com.empresa.gestorinventario.model.dto.request.PresupuestoRequest;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.dto.response.PresupuestoResponse;
import com.empresa.gestorinventario.model.entity.Cliente;
import com.empresa.gestorinventario.model.entity.LineaPresupuesto;
import com.empresa.gestorinventario.model.entity.Material;
import com.empresa.gestorinventario.model.entity.Presupuesto;
import com.empresa.gestorinventario.model.enums.EstadoPresupuesto;
import com.empresa.gestorinventario.repository.ClienteRepository;
import com.empresa.gestorinventario.repository.MaterialRepository;
import com.empresa.gestorinventario.repository.PresupuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PresupuestoService {

    private final PresupuestoRepository presupuestoRepository;
    private final ClienteRepository clienteRepository;
    private final MaterialRepository materialRepository;

    public PaginaResponse<PresupuestoResponse> listar(Pageable pageable) {
        Page<Presupuesto> pagina = presupuestoRepository.findAll(pageable);

        return PaginaResponse.<PresupuestoResponse>builder()
                .contenido(pagina.getContent().stream().map(this::toResponse).toList())
                .paginaActual(pagina.getNumber())
                .totalPaginas(pagina.getTotalPages())
                .totalElementos(pagina.getTotalElements())
                .primera(pagina.isFirst())
                .ultima(pagina.isLast())
                .build();
    }

    public PresupuestoResponse obtenerPorId(Long id) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Presupuesto", id));
        return toResponse(presupuesto);
    }

    @Transactional
    public PresupuestoResponse crear(PresupuestoRequest request) {
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", request.getClienteId()));

        String numero = generarNumero();

        Presupuesto presupuesto = Presupuesto.builder()
                .numero(numero)
                .cliente(cliente)
                .fechaEmision(LocalDate.now())
                .fechaValidez(request.getFechaValidez())
                .estado(EstadoPresupuesto.BORRADOR)
                .descripcion(request.getDescripcion())
                .observaciones(request.getObservaciones())
                .build();

        List<LineaPresupuesto> lineas = request.getLineas().stream()
                .map(lr -> {
                    Material material = materialRepository.findById(lr.getMaterialId())
                            .orElseThrow(() -> new RecursoNoEncontradoException("Material", lr.getMaterialId()));
                    return LineaPresupuesto.builder()
                            .presupuesto(presupuesto)
                            .material(material)
                            .cantidad(lr.getCantidad() != null ? lr.getCantidad() : 1)
                            .precioUnitario(lr.getPrecioUnitario())
                            .descripcion(lr.getDescripcion())
                            .build();
                })
                .toList();

        presupuesto.setLineas(lineas);

        return toResponse(presupuestoRepository.save(presupuesto));
    }

    @Transactional
    public PresupuestoResponse actualizar(Long id, PresupuestoRequest request) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Presupuesto", id));

        if (presupuesto.getEstado() != EstadoPresupuesto.BORRADOR) {
            throw new NegocioException("Solo se pueden editar presupuestos en estado BORRADOR");
        }

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", request.getClienteId()));

        presupuesto.setCliente(cliente);
        presupuesto.setFechaValidez(request.getFechaValidez());
        presupuesto.setDescripcion(request.getDescripcion());
        presupuesto.setObservaciones(request.getObservaciones());

        presupuesto.getLineas().clear();

        List<LineaPresupuesto> lineas = request.getLineas().stream()
                .map(lr -> {
                    Material material = materialRepository.findById(lr.getMaterialId())
                            .orElseThrow(() -> new RecursoNoEncontradoException("Material", lr.getMaterialId()));
                    return LineaPresupuesto.builder()
                            .presupuesto(presupuesto)
                            .material(material)
                            .cantidad(lr.getCantidad() != null ? lr.getCantidad() : 1)
                            .precioUnitario(lr.getPrecioUnitario())
                            .descripcion(lr.getDescripcion())
                            .build();
                })
                .toList();

        presupuesto.getLineas().addAll(lineas);

        return toResponse(presupuestoRepository.save(presupuesto));
    }

    @Transactional
    public PresupuestoResponse cambiarEstado(Long id, EstadoPresupuesto nuevoEstado) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Presupuesto", id));

        presupuesto.setEstado(nuevoEstado);
        return toResponse(presupuestoRepository.save(presupuesto));
    }

    @Transactional
    public void eliminar(Long id) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Presupuesto", id));

        if (presupuesto.getEstado() != EstadoPresupuesto.BORRADOR) {
            throw new NegocioException("Solo se pueden eliminar presupuestos en estado BORRADOR");
        }

        presupuestoRepository.delete(presupuesto);
    }

    private String generarNumero() {
        String year = String.valueOf(LocalDate.now().getYear());
        Integer maxSecuencial = presupuestoRepository.findMaxNumeroByYear(year);
        int siguiente = (maxSecuencial != null ? maxSecuencial : 0) + 1;
        return String.format("%s-%04d", year, siguiente);
    }

    private PresupuestoResponse toResponse(Presupuesto p) {
        List<PresupuestoResponse.LineaInfo> lineasInfo = p.getLineas().stream()
                .map(l -> {
                    BigDecimal subtotal = l.getPrecioUnitario()
                            .multiply(BigDecimal.valueOf(l.getCantidad()));
                    return PresupuestoResponse.LineaInfo.builder()
                            .id(l.getId())
                            .materialId(l.getMaterial().getId())
                            .materialNombre(l.getMaterial().getNombre())
                            .cantidad(l.getCantidad())
                            .precioUnitario(l.getPrecioUnitario())
                            .subtotal(subtotal)
                            .descripcion(l.getDescripcion())
                            .build();
                })
                .toList();

        BigDecimal total = lineasInfo.stream()
                .map(PresupuestoResponse.LineaInfo::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return PresupuestoResponse.builder()
                .id(p.getId())
                .numero(p.getNumero())
                .cliente(PresupuestoResponse.ClienteInfo.builder()
                        .id(p.getCliente().getId())
                        .razonSocial(p.getCliente().getRazonSocial())
                        .build())
                .fechaEmision(p.getFechaEmision())
                .fechaValidez(p.getFechaValidez())
                .estado(p.getEstado())
                .descripcion(p.getDescripcion())
                .observaciones(p.getObservaciones())
                .lineas(lineasInfo)
                .total(total)
                .creadoEn(p.getCreadoEn())
                .build();
    }
}

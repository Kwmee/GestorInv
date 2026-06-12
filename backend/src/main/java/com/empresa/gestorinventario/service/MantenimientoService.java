// service/MantenimientoService.java
package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.RecursoNoEncontradoException;
import com.empresa.gestorinventario.model.dto.request.MantenimientoRequest;
import com.empresa.gestorinventario.model.dto.response.MantenimientoResponse;
import com.empresa.gestorinventario.model.entity.Mantenimiento;
import com.empresa.gestorinventario.model.entity.Material;
import com.empresa.gestorinventario.model.enums.EstadoMantenimiento;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import com.empresa.gestorinventario.repository.MantenimientoRepository;
import com.empresa.gestorinventario.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MantenimientoService {

    private final MantenimientoRepository mantenimientoRepository;
    private final MaterialRepository materialRepository;

    public List<MantenimientoResponse> listarPorMaterial(Long materialId) {
        return mantenimientoRepository.findByMaterialIdOrderByFechaEntradaDesc(materialId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MantenimientoResponse obtenerPorId(Long id) {
        Mantenimiento mantenimiento = mantenimientoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Mantenimiento", id));
        return toResponse(mantenimiento);
    }

    @Transactional
    public MantenimientoResponse crear(MantenimientoRequest request) {
        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Material", request.getMaterialId()));

        EstadoMantenimiento estadoSolicitado = request.getEstado() != null
                ? request.getEstado()
                : EstadoMantenimiento.EN_REVISION;

        if (estadoSolicitado == EstadoMantenimiento.EN_REVISION) {
            material.setEstado(EstadoMaterial.EN_REPARACION);
            materialRepository.save(material);
        }

        Mantenimiento mantenimiento = Mantenimiento.builder()
                .material(material)
                .fechaEntrada(request.getFechaEntrada())
                .fechaSalida(request.getFechaSalida())
                .descripcion(request.getDescripcion())
                .tecnicoExterno(request.getTecnicoExterno())
                .coste(request.getCoste())
                .estado(estadoSolicitado)
                .observaciones(request.getObservaciones())
                .build();

        return toResponse(mantenimientoRepository.save(mantenimiento));
    }

    @Transactional
    public MantenimientoResponse actualizar(Long id, MantenimientoRequest request) {
        Mantenimiento mantenimiento = mantenimientoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Mantenimiento", id));

        EstadoMantenimiento estadoNuevo = request.getEstado() != null
                ? request.getEstado()
                : mantenimiento.getEstado();

        if (estadoNuevo != mantenimiento.getEstado()) {
            Material material = mantenimiento.getMaterial();
            if (estadoNuevo == EstadoMantenimiento.REPARADO) {
                material.setEstado(EstadoMaterial.DISPONIBLE);
                materialRepository.save(material);
            } else if (estadoNuevo == EstadoMantenimiento.IRREPARABLE) {
                material.setEstado(EstadoMaterial.BAJA);
                materialRepository.save(material);
            }
        }

        mantenimiento.setFechaEntrada(request.getFechaEntrada());
        mantenimiento.setFechaSalida(request.getFechaSalida());
        mantenimiento.setDescripcion(request.getDescripcion());
        mantenimiento.setTecnicoExterno(request.getTecnicoExterno());
        mantenimiento.setCoste(request.getCoste());
        mantenimiento.setEstado(estadoNuevo);
        mantenimiento.setObservaciones(request.getObservaciones());

        return toResponse(mantenimientoRepository.save(mantenimiento));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!mantenimientoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Mantenimiento", id);
        }
        mantenimientoRepository.deleteById(id);
    }

    private MantenimientoResponse toResponse(Mantenimiento m) {
        Material mat = m.getMaterial();
        return MantenimientoResponse.builder()
                .id(m.getId())
                .material(MantenimientoResponse.MaterialInfo.builder()
                        .id(mat.getId())
                        .nombre(mat.getNombre())
                        .marca(mat.getMarca())
                        .modelo(mat.getModelo())
                        .build())
                .fechaEntrada(m.getFechaEntrada())
                .fechaSalida(m.getFechaSalida())
                .descripcion(m.getDescripcion())
                .tecnicoExterno(m.getTecnicoExterno())
                .coste(m.getCoste())
                .estado(m.getEstado())
                .observaciones(m.getObservaciones())
                .creadoEn(m.getCreadoEn())
                .build();
    }
}

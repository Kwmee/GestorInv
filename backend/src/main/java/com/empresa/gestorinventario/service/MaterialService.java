package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.NegocioException;
import com.empresa.gestorinventario.exception.RecursoNoEncontradoException;
import com.empresa.gestorinventario.model.dto.request.MaterialRequest;
import com.empresa.gestorinventario.model.dto.response.MaterialResponse;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.entity.CategoriaMaterial;
import com.empresa.gestorinventario.model.entity.HistorialEstado;
import com.empresa.gestorinventario.model.entity.Material;
import com.empresa.gestorinventario.model.entity.Usuario;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import com.empresa.gestorinventario.repository.CategoriaMaterialRepository;
import com.empresa.gestorinventario.repository.HistorialEstadoRepository;
import com.empresa.gestorinventario.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CategoriaMaterialRepository categoriaRepository;
    private final HistorialEstadoRepository historialRepository;
    private final PdfService pdfService;

    public PaginaResponse<MaterialResponse> listar(EstadoMaterial estado, Long categoriaId,
                                                    String busqueda, Pageable pageable) {
        Page<Material> pagina = materialRepository.buscarConFiltros(estado, categoriaId, busqueda, pageable);

        return PaginaResponse.<MaterialResponse>builder()
            .contenido(pagina.getContent().stream().map(this::toResponse).toList())
            .paginaActual(pagina.getNumber())
            .totalPaginas(pagina.getTotalPages())
            .totalElementos(pagina.getTotalElements())
            .primera(pagina.isFirst())
            .ultima(pagina.isLast())
            .build();
    }

    public MaterialResponse obtenerPorId(Long id) {
        return toResponse(obtenerEntidad(id));
    }

    @Transactional
    public MaterialResponse crear(MaterialRequest request) {
        if (request.getNumeroSerie() != null && !request.getNumeroSerie().isBlank()
                && materialRepository.existsByNumeroSerie(request.getNumeroSerie())) {
            throw new NegocioException("Ya existe material con el número de serie: " + request.getNumeroSerie());
        }

        CategoriaMaterial categoria = categoriaRepository.findById(request.getCategoriaId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Categoría", request.getCategoriaId()));

        Material material = Material.builder()
            .categoria(categoria)
            .nombre(request.getNombre())
            .descripcion(request.getDescripcion())
            .marca(request.getMarca())
            .modelo(request.getModelo())
            .numeroSerie(request.getNumeroSerie())
            .cantidad(request.getCantidad())
            .estado(EstadoMaterial.DISPONIBLE)
            .valorUnitario(request.getValorUnitario())
            .fechaAdquisicion(request.getFechaAdquisicion())
            .esFungible(request.getEsFungible() != null && request.getEsFungible())
            .stockMinimo(request.getStockMinimo() != null ? request.getStockMinimo() : 0)
            .observaciones(request.getObservaciones())
            .build();

        return toResponse(materialRepository.save(material));
    }

    @Transactional
    public MaterialResponse actualizar(Long id, MaterialRequest request) {
        Material material = obtenerEntidad(id);

        if (request.getNumeroSerie() != null && !request.getNumeroSerie().isBlank()
                && !request.getNumeroSerie().equals(material.getNumeroSerie())
                && materialRepository.existsByNumeroSerie(request.getNumeroSerie())) {
            throw new NegocioException("Ya existe material con el número de serie: " + request.getNumeroSerie());
        }

        CategoriaMaterial categoria = categoriaRepository.findById(request.getCategoriaId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Categoría", request.getCategoriaId()));

        material.setCategoria(categoria);
        material.setNombre(request.getNombre());
        material.setDescripcion(request.getDescripcion());
        material.setMarca(request.getMarca());
        material.setModelo(request.getModelo());
        material.setNumeroSerie(request.getNumeroSerie());
        material.setCantidad(request.getCantidad());
        material.setValorUnitario(request.getValorUnitario());
        material.setFechaAdquisicion(request.getFechaAdquisicion());
        material.setEsFungible(request.getEsFungible() != null && request.getEsFungible());
        material.setStockMinimo(request.getStockMinimo() != null ? request.getStockMinimo() : 0);
        material.setObservaciones(request.getObservaciones());

        return toResponse(materialRepository.save(material));
    }

    @Transactional
    public void darDeBaja(Long id) {
        Material material = obtenerEntidad(id);

        if (material.getEstado() == EstadoMaterial.EN_EVENTO) {
            throw new NegocioException("No se puede dar de baja un material que está en un evento activo");
        }

        material.setEstado(EstadoMaterial.BAJA);
        material.setActivo(false);
        materialRepository.save(material);
    }

    @Transactional
    public void cambiarEstado(Material material, EstadoMaterial nuevoEstado,
                               Usuario usuario, String observaciones) {
        EstadoMaterial estadoAnterior = material.getEstado();
        material.setEstado(nuevoEstado);
        materialRepository.save(material);

        HistorialEstado historial = HistorialEstado.builder()
            .material(material)
            .usuario(usuario)
            .estadoAnterior(estadoAnterior)
            .estadoNuevo(nuevoEstado)
            .observaciones(observaciones)
            .build();

        historialRepository.save(historial);
    }

    public List<MaterialResponse> obtenerHistorial(Long id) {
        obtenerEntidad(id);
        return historialRepository.findByMaterialIdOrderByFechaDesc(id).stream()
            .map(h -> MaterialResponse.builder()
                .id(h.getMaterial().getId())
                .nombre(h.getMaterial().getNombre())
                .estado(h.getEstadoNuevo())
                .observaciones(h.getObservaciones())
                .creadoEn(h.getFecha())
                .build())
            .toList();
    }

    public byte[] generarListadoPdf(EstadoMaterial estado, Long categoriaId, String busqueda) {
        List<Material> materiales = materialRepository.buscarParaListado(estado, categoriaId, busqueda);
        return pdfService.generarListadoInventario(materiales, estado, busqueda);
    }

    public Material obtenerEntidad(Long id) {
        return materialRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Material", id));
    }

    private MaterialResponse toResponse(Material m) {
        return MaterialResponse.builder()
            .id(m.getId())
            .categoria(MaterialResponse.CategoriaInfo.builder()
                .id(m.getCategoria().getId())
                .nombre(m.getCategoria().getNombre())
                .build())
            .nombre(m.getNombre())
            .descripcion(m.getDescripcion())
            .marca(m.getMarca())
            .modelo(m.getModelo())
            .numeroSerie(m.getNumeroSerie())
            .cantidad(m.getCantidad())
            .estado(m.getEstado())
            .valorUnitario(m.getValorUnitario())
            .fechaAdquisicion(m.getFechaAdquisicion())
            .esFungible(m.getEsFungible())
            .stockMinimo(m.getStockMinimo())
            .observaciones(m.getObservaciones())
            .creadoEn(m.getCreadoEn())
            .actualizadoEn(m.getActualizadoEn())
            .build();
    }
}

package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.request.MaterialRequest;
import com.empresa.gestorinventario.model.dto.response.MaterialResponse;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.entity.CategoriaMaterial;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import com.empresa.gestorinventario.repository.CategoriaMaterialRepository;
import com.empresa.gestorinventario.service.MaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/material")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;
    private final CategoriaMaterialRepository categoriaRepository;

    @GetMapping
    public ResponseEntity<PaginaResponse<MaterialResponse>> listar(
            @RequestParam(required = false) EstadoMaterial estado,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("nombre").ascending());
        return ResponseEntity.ok(materialService.listar(estado, categoriaId, q, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<MaterialResponse> crear(@Valid @RequestBody MaterialRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(materialService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponse> actualizar(
            @PathVariable Long id, @Valid @RequestBody MaterialRequest request) {
        return ResponseEntity.ok(materialService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> darDeBaja(@PathVariable Long id) {
        materialService.darDeBaja(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/historial")
    public ResponseEntity<List<MaterialResponse>> historial(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.obtenerHistorial(id));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaMaterial>> listarCategorias() {
        return ResponseEntity.ok(categoriaRepository.findAll());
    }
}

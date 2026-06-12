// controller/MantenimientoController.java
package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.request.MantenimientoRequest;
import com.empresa.gestorinventario.model.dto.response.MantenimientoResponse;
import com.empresa.gestorinventario.service.MantenimientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mantenimiento")
@RequiredArgsConstructor
public class MantenimientoController {

    private final MantenimientoService mantenimientoService;

    @GetMapping
    public ResponseEntity<List<MantenimientoResponse>> listarPorMaterial(
            @RequestParam Long materialId) {
        return ResponseEntity.ok(mantenimientoService.listarPorMaterial(materialId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MantenimientoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(mantenimientoService.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','OPERARIO')")
    public ResponseEntity<MantenimientoResponse> crear(
            @Valid @RequestBody MantenimientoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mantenimientoService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','OPERARIO')")
    public ResponseEntity<MantenimientoResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody MantenimientoRequest request) {
        return ResponseEntity.ok(mantenimientoService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        mantenimientoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

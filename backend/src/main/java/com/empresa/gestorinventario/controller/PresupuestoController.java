// controller/PresupuestoController.java
package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.request.PresupuestoRequest;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.dto.response.PresupuestoResponse;
import com.empresa.gestorinventario.model.enums.EstadoPresupuesto;
import com.empresa.gestorinventario.service.PresupuestoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/presupuestos")
@RequiredArgsConstructor
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    @GetMapping
    public ResponseEntity<PaginaResponse<PresupuestoResponse>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("fechaEmision").descending());
        return ResponseEntity.ok(presupuestoService.listar(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PresupuestoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(presupuestoService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<PresupuestoResponse> crear(
            @Valid @RequestBody PresupuestoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(presupuestoService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PresupuestoResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody PresupuestoRequest request) {
        return ResponseEntity.ok(presupuestoService.actualizar(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<PresupuestoResponse> cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoPresupuesto estado) {
        return ResponseEntity.ok(presupuestoService.cambiarEstado(id, estado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        presupuestoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

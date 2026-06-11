package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.request.DevolucionRequest;
import com.empresa.gestorinventario.model.dto.request.EventoRequest;
import com.empresa.gestorinventario.model.dto.response.AlbaranResponse;
import com.empresa.gestorinventario.model.dto.response.EventoResponse;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.enums.EstadoEvento;
import com.empresa.gestorinventario.service.EventoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService eventoService;

    @GetMapping
    public ResponseEntity<PaginaResponse<EventoResponse>> listar(
            @RequestParam(required = false) EstadoEvento estado,
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("fechaInicio").descending());
        return ResponseEntity.ok(eventoService.listar(estado, clienteId, fechaDesde, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<EventoResponse> crear(@Valid @RequestBody EventoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventoService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoResponse> actualizar(
            @PathVariable Long id, @Valid @RequestBody EventoRequest request) {
        return ResponseEntity.ok(eventoService.actualizar(id, request));
    }

    @PostMapping("/{id}/material")
    public ResponseEntity<EventoResponse> agregarMaterial(
            @PathVariable Long id,
            @RequestBody List<EventoRequest.LineaMaterialRequest> lineas) {
        return ResponseEntity.ok(eventoService.agregarMaterial(id, lineas));
    }

    @DeleteMapping("/{id}/material/{materialId}")
    public ResponseEntity<Void> quitarMaterial(
            @PathVariable Long id, @PathVariable Long materialId) {
        eventoService.quitarMaterial(id, materialId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/confirmar-salida")
    public ResponseEntity<AlbaranResponse> confirmarSalida(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.confirmarSalida(id));
    }

    @PostMapping("/{id}/devolucion")
    public ResponseEntity<AlbaranResponse> registrarDevolucion(
            @PathVariable Long id, @Valid @RequestBody DevolucionRequest request) {
        return ResponseEntity.ok(eventoService.registrarDevolucion(id, request));
    }

    @GetMapping("/{id}/lista-carga")
    public ResponseEntity<byte[]> listaCarga(@PathVariable Long id) {
        byte[] pdf = eventoService.generarListaCarga(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"lista-carga-" + id + ".pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }
}

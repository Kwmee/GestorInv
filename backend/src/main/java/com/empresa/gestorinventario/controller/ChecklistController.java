package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.request.ChecklistItemRequest;
import com.empresa.gestorinventario.model.dto.response.ChecklistItemResponse;
import com.empresa.gestorinventario.service.ChecklistService;
import com.empresa.gestorinventario.service.EventoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@RequiredArgsConstructor
public class ChecklistController {

    private final ChecklistService checklistService;
    private final EventoService eventoService;

    @PostMapping("/{id}/iniciar-carga")
    @PreAuthorize("hasAnyRole('ADMIN','OPERARIO')")
    public ResponseEntity<List<ChecklistItemResponse>> iniciarCarga(@PathVariable Long id) {
        return ResponseEntity.ok(checklistService.iniciarCarga(id));
    }

    @GetMapping("/{id}/checklist")
    public ResponseEntity<List<ChecklistItemResponse>> obtenerChecklist(@PathVariable Long id) {
        return ResponseEntity.ok(checklistService.obtenerChecklist(id));
    }

    @PutMapping("/{id}/checklist/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN','OPERARIO')")
    public ResponseEntity<ChecklistItemResponse> marcarItem(
            @PathVariable Long id,
            @PathVariable Long itemId,
            @Valid @RequestBody ChecklistItemRequest request) {
        return ResponseEntity.ok(checklistService.marcarItem(id, itemId, request));
    }

    @PostMapping("/{id}/iniciar-devolucion")
    @PreAuthorize("hasAnyRole('ADMIN','OPERARIO')")
    public ResponseEntity<Void> iniciarDevolucion(@PathVariable Long id) {
        eventoService.iniciarDevolucion(id);
        return ResponseEntity.ok().build();
    }
}

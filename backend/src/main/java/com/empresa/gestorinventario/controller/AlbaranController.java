package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.response.AlbaranResponse;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.enums.TipoAlbaran;
import com.empresa.gestorinventario.service.AlbaranService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/albaranes")
@RequiredArgsConstructor
public class AlbaranController {

    private final AlbaranService albaranService;

    @GetMapping
    public ResponseEntity<PaginaResponse<AlbaranResponse>> listar(
            @RequestParam(required = false) TipoAlbaran tipo,
            @RequestParam(required = false) Long eventoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("fechaEmision").descending());
        return ResponseEntity.ok(albaranService.listar(tipo, eventoId, fechaDesde, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlbaranResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(albaranService.obtenerPorId(id));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Long id) {
        AlbaranResponse albaran = albaranService.obtenerPorId(id);
        byte[] pdf = albaranService.obtenerPdf(id);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + albaran.getNumero() + ".pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }
}

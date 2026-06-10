package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.request.EmpresaRequest;
import com.empresa.gestorinventario.model.dto.response.EmpresaResponse;
import com.empresa.gestorinventario.service.EmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/config")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;

    @GetMapping("/empresa")
    public ResponseEntity<EmpresaResponse> obtener() {
        return ResponseEntity.ok(empresaService.obtener());
    }

    @PutMapping("/empresa")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmpresaResponse> actualizar(@Valid @RequestBody EmpresaRequest req) {
        return ResponseEntity.ok(empresaService.actualizar(req));
    }

    @PostMapping(value = "/empresa/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> subirLogo(@RequestParam("archivo") MultipartFile archivo) throws IOException {
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        empresaService.subirLogo(archivo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/empresa/logo")
    public ResponseEntity<byte[]> obtenerLogo() {
        byte[] bytes = empresaService.obtenerLogoBytes();
        if (bytes == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(bytes);
    }
}

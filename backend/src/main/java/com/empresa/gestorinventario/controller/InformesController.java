// controller/InformesController.java
package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.response.InformesResponse;
import com.empresa.gestorinventario.service.InformesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/informes")
@RequiredArgsConstructor
public class InformesController {

    private final InformesService informesService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERARIO')")
    public ResponseEntity<InformesResponse> obtenerInformes() {
        return ResponseEntity.ok(informesService.obtenerInformes());
    }
}

// controller/BusquedaController.java
package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.response.BusquedaResponse;
import com.empresa.gestorinventario.service.BusquedaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/busqueda")
@RequiredArgsConstructor
public class BusquedaController {

    private final BusquedaService busquedaService;

    @GetMapping
    public ResponseEntity<BusquedaResponse> buscar(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(busquedaService.buscar(q));
    }
}

package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.response.RedStatusResponse;
import com.empresa.gestorinventario.service.RedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/config/red")
@RequiredArgsConstructor
public class RedController {

    private final RedService redService;

    @GetMapping
    public ResponseEntity<RedStatusResponse> obtenerEstado() {
        return ResponseEntity.ok(redService.obtenerEstado());
    }

    @PostMapping
    public ResponseEntity<RedStatusResponse> cambiarModo(@RequestBody ModoRedRequest request) {
        return ResponseEntity.ok(redService.establecerModo(request.modoRed()));
    }

    record ModoRedRequest(boolean modoRed) {}
}

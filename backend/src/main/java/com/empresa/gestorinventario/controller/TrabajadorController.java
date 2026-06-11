package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.entity.Trabajador;
import com.empresa.gestorinventario.service.TrabajadorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trabajadores")
@RequiredArgsConstructor
public class TrabajadorController {

    private final TrabajadorService trabajadorService;

    record NombreRequest(@NotBlank String nombre) {}

    @GetMapping
    public ResponseEntity<List<Trabajador>> listar() {
        return ResponseEntity.ok(trabajadorService.listar());
    }

    @PostMapping
    public ResponseEntity<Trabajador> crear(@RequestBody @Valid NombreRequest body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trabajadorService.crear(body.nombre()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        trabajadorService.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}

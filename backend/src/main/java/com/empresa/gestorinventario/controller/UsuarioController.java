package com.empresa.gestorinventario.controller;

import com.empresa.gestorinventario.model.dto.request.CambiarContrasenaRequest;
import com.empresa.gestorinventario.model.dto.request.PerfilRequest;
import com.empresa.gestorinventario.model.dto.response.UsuarioResponse;
import com.empresa.gestorinventario.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> obtenerPerfil(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(usuarioService.obtenerPerfil(ud.getUsername()));
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponse> actualizarPerfil(
            @AuthenticationPrincipal UserDetails ud,
            @Valid @RequestBody PerfilRequest request) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(ud.getUsername(), request));
    }

    @PutMapping("/cambiar-contrasena")
    public ResponseEntity<Void> cambiarContrasena(
            @AuthenticationPrincipal UserDetails ud,
            @Valid @RequestBody CambiarContrasenaRequest request) {
        usuarioService.cambiarContrasena(ud.getUsername(), request);
        return ResponseEntity.noContent().build();
    }
}

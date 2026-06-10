package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.NegocioException;
import com.empresa.gestorinventario.model.dto.request.CambiarContrasenaRequest;
import com.empresa.gestorinventario.model.dto.request.PerfilRequest;
import com.empresa.gestorinventario.model.dto.response.UsuarioResponse;
import com.empresa.gestorinventario.model.entity.Usuario;
import com.empresa.gestorinventario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponse obtenerPerfil(String email) {
        Usuario u = usuarioRepository.findByEmail(email).orElseThrow();
        return toResponse(u);
    }

    @Transactional
    public UsuarioResponse actualizarPerfil(String emailActual, PerfilRequest request) {
        Usuario u = usuarioRepository.findByEmail(emailActual).orElseThrow();

        if (!emailActual.equals(request.getEmail())) {
            usuarioRepository.findByEmail(request.getEmail()).ifPresent(otro -> {
                throw new NegocioException("Ya existe un usuario con ese email");
            });
        }

        u.setNombre(request.getNombre());
        u.setEmail(request.getEmail());
        return toResponse(u);
    }

    @Transactional
    public void cambiarContrasena(String email, CambiarContrasenaRequest request) {
        Usuario u = usuarioRepository.findByEmail(email).orElseThrow();

        if (!passwordEncoder.matches(request.getContrasenaActual(), u.getPasswordHash())) {
            throw new NegocioException("La contraseña actual no es correcta");
        }

        u.setPasswordHash(passwordEncoder.encode(request.getContrasenaNueva()));
    }

    private UsuarioResponse toResponse(Usuario u) {
        return UsuarioResponse.builder()
            .id(u.getId())
            .nombre(u.getNombre())
            .email(u.getEmail())
            .rol(u.getRol())
            .build();
    }
}

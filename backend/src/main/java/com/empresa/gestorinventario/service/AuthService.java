package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.model.dto.request.LoginRequest;
import com.empresa.gestorinventario.model.dto.response.AuthResponse;
import com.empresa.gestorinventario.model.entity.Usuario;
import com.empresa.gestorinventario.repository.UsuarioRepository;
import com.empresa.gestorinventario.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UsuarioRepository usuarioRepository;

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generarToken(auth);
        LocalDateTime expiracion = LocalDateTime.now()
            .plusSeconds(tokenProvider.getExpiracionMs() / 1000);

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();

        return AuthResponse.builder()
            .token(token)
            .tipo("Bearer")
            .expiracion(expiracion)
            .usuario(AuthResponse.UsuarioInfo.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .build())
            .build();
    }
}

package com.empresa.gestorinventario.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiracion-ms}")
    private long jwtExpiracionMs;

    public String generarToken(Authentication authentication) {
        String email = authentication.getName();
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + jwtExpiracionMs);

        return Jwts.builder()
            .subject(email)
            .issuedAt(ahora)
            .expiration(expiracion)
            .signWith(obtenerClave())
            .compact();
    }

    public String obtenerEmailDelToken(String token) {
        return Jwts.parser()
            .verifyWith(obtenerClave())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(obtenerClave())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException e) {
            log.warn("Token JWT mal formado");
        } catch (ExpiredJwtException e) {
            log.warn("Token JWT expirado");
        } catch (UnsupportedJwtException e) {
            log.warn("Token JWT no soportado");
        } catch (IllegalArgumentException e) {
            log.warn("Claims JWT vacíos");
        }
        return false;
    }

    public long getExpiracionMs() {
        return jwtExpiracionMs;
    }

    private SecretKey obtenerClave() {
        byte[] claveBytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes())
        );
        return Keys.hmacShaKeyFor(claveBytes);
    }
}

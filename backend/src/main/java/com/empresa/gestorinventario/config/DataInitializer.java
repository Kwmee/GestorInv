package com.empresa.gestorinventario.config;

import com.empresa.gestorinventario.model.entity.Usuario;
import com.empresa.gestorinventario.model.enums.RolUsuario;
import com.empresa.gestorinventario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        boolean existeAdmin = usuarioRepository.findAll().stream()
                .anyMatch(u -> u.getRol() == RolUsuario.ADMIN);

        if (!existeAdmin) {
            Usuario admin = Usuario.builder()
                    .nombre("Administrador")
                    .email("admin@empresa.com")
                    .passwordHash(passwordEncoder.encode("Admin1234!"))
                    .rol(RolUsuario.ADMIN)
                    .activo(true)
                    .build();
            usuarioRepository.save(admin);
            log.info("Usuario admin creado: admin@empresa.com / Admin1234!");
        }
    }
}

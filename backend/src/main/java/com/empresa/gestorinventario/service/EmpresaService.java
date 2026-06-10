package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.model.dto.request.EmpresaRequest;
import com.empresa.gestorinventario.model.dto.response.EmpresaResponse;
import com.empresa.gestorinventario.model.entity.EmpresaConfiguracion;
import com.empresa.gestorinventario.repository.EmpresaConfiguracionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmpresaService {

    private final EmpresaConfiguracionRepository repo;

    @Value("${app.empresa.logo-ruta:/app/albaranes-pdf/logo.png}")
    private String logoSavePath;

    public EmpresaConfiguracion obtenerConfig() {
        return repo.findById(1L).orElseGet(() -> {
            EmpresaConfiguracion c = new EmpresaConfiguracion();
            c.setId(1L);
            c.setNombre("Mi Empresa");
            return repo.save(c);
        });
    }

    public EmpresaResponse obtener() {
        EmpresaConfiguracion config = obtenerConfig();
        return toResponse(config);
    }

    public EmpresaResponse actualizar(EmpresaRequest req) {
        EmpresaConfiguracion config = obtenerConfig();
        config.setNombre(req.getNombre());
        config.setDireccion(req.getDireccion());
        config.setTelefono(req.getTelefono());
        config.setEmail(req.getEmail());
        return toResponse(repo.save(config));
    }

    public void subirLogo(MultipartFile archivo) throws IOException {
        Path destino = Paths.get(logoSavePath);
        Files.createDirectories(destino.getParent());
        Files.write(destino, archivo.getBytes());

        EmpresaConfiguracion config = obtenerConfig();
        config.setLogoPath(logoSavePath);
        repo.save(config);
        log.info("Logo actualizado en {}", logoSavePath);
    }

    public byte[] obtenerLogoBytes() {
        try {
            EmpresaConfiguracion config = obtenerConfig();
            String path = config.getLogoPath() != null ? config.getLogoPath() : logoSavePath;
            Path p = Paths.get(path);
            if (Files.exists(p)) {
                return Files.readAllBytes(p);
            }
        } catch (Exception e) {
            log.warn("No se pudo leer el logo: {}", e.getMessage());
        }
        return null;
    }

    private EmpresaResponse toResponse(EmpresaConfiguracion c) {
        String path = c.getLogoPath() != null ? c.getLogoPath() : logoSavePath;
        return EmpresaResponse.builder()
            .nombre(c.getNombre())
            .direccion(c.getDireccion())
            .telefono(c.getTelefono())
            .email(c.getEmail())
            .tieneLogo(Files.exists(Paths.get(path)))
            .build();
    }
}

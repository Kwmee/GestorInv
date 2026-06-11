package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.model.dto.response.RedStatusResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.*;
import java.nio.file.*;
import java.util.*;

@Service
@Slf4j
public class RedService {

    private static final Path CONFIG_EXTERNO = Paths.get("./config/application.properties");

    @Value("${server.port:8080}")
    private int puerto;

    public RedStatusResponse obtenerEstado() {
        return new RedStatusResponse(leerModoRed(), obtenerIpsLocales(), puerto);
    }

    public RedStatusResponse establecerModo(boolean modoRed) {
        Properties props = leerConfig();
        props.setProperty("server.address", modoRed ? "0.0.0.0" : "127.0.0.1");
        guardarConfig(props);

        // Solo reinicia cuando corre como servicio Windows (instalado)
        if (System.getenv("GESTOR_SERVICE_MODE") != null) {
            lanzarReinicio();
        }

        return new RedStatusResponse(modoRed, obtenerIpsLocales(), puerto);
    }

    private boolean leerModoRed() {
        return "0.0.0.0".equals(leerConfig().getProperty("server.address", "127.0.0.1"));
    }

    private Properties leerConfig() {
        Properties props = new Properties();
        if (Files.exists(CONFIG_EXTERNO)) {
            try (InputStream in = Files.newInputStream(CONFIG_EXTERNO)) {
                props.load(in);
            } catch (IOException e) {
                log.warn("No se pudo leer config externo: {}", e.getMessage());
            }
        }
        return props;
    }

    private void guardarConfig(Properties props) {
        try {
            Files.createDirectories(CONFIG_EXTERNO.getParent());
            try (OutputStream out = Files.newOutputStream(CONFIG_EXTERNO)) {
                props.store(out, "GestorInventario configuracion de red");
            }
        } catch (IOException e) {
            throw new RuntimeException("No se pudo guardar la configuracion de red", e);
        }
    }

    private List<String> obtenerIpsLocales() {
        List<String> ips = new ArrayList<>();
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            while (interfaces.hasMoreElements()) {
                NetworkInterface ni = interfaces.nextElement();
                if (!ni.isUp() || ni.isLoopback() || ni.isVirtual()) continue;
                Enumeration<InetAddress> addrs = ni.getInetAddresses();
                while (addrs.hasMoreElements()) {
                    InetAddress addr = addrs.nextElement();
                    if (addr instanceof Inet4Address && !addr.isLoopbackAddress()) {
                        ips.add(addr.getHostAddress());
                    }
                }
            }
        } catch (SocketException e) {
            log.warn("No se pudieron obtener las IPs locales: {}", e.getMessage());
        }
        return ips;
    }

    private void lanzarReinicio() {
        String baseDir = System.getenv("GESTOR_BASE_DIR");
        String script = (baseDir != null ? baseDir : ".") + "\\scripts\\restart-app.bat";
        try {
            new ProcessBuilder("cmd", "/c", "start", "/b", script).start();
        } catch (IOException e) {
            log.error("No se pudo lanzar el script de reinicio: {}", e.getMessage());
        }
        Thread t = new Thread(() -> {
            try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
            System.exit(0);
        });
        t.setDaemon(true);
        t.start();
    }
}

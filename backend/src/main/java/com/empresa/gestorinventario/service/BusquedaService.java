// service/BusquedaService.java
package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.model.dto.response.BusquedaResponse;
import com.empresa.gestorinventario.repository.ClienteRepository;
import com.empresa.gestorinventario.repository.EventoRepository;
import com.empresa.gestorinventario.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BusquedaService {

    private final MaterialRepository materialRepository;
    private final EventoRepository eventoRepository;
    private final ClienteRepository clienteRepository;

    public BusquedaResponse buscar(String q) {
        if (q == null || q.isBlank() || q.trim().length() < 2) {
            return BusquedaResponse.builder()
                    .material(List.of())
                    .eventos(List.of())
                    .clientes(List.of())
                    .build();
        }

        String termino = q.trim();

        List<BusquedaResponse.ResultadoMaterial> materiales = materialRepository
                .buscarConFiltros(null, null, termino, PageRequest.of(0, 5))
                .getContent()
                .stream()
                .map(m -> BusquedaResponse.ResultadoMaterial.builder()
                        .id(m.getId())
                        .nombre(m.getNombre())
                        .marca(m.getMarca())
                        .estado(m.getEstado())
                        .categoriaNombre(m.getCategoria().getNombre())
                        .build())
                .toList();

        List<BusquedaResponse.ResultadoEvento> eventos = eventoRepository.findAll().stream()
                .filter(e -> contieneIgnoreCase(e.getNombre(), termino)
                        || contieneIgnoreCase(e.getLugar(), termino))
                .limit(5)
                .map(e -> BusquedaResponse.ResultadoEvento.builder()
                        .id(e.getId())
                        .nombre(e.getNombre())
                        .lugar(e.getLugar())
                        .estado(e.getEstado())
                        .clienteNombre(e.getCliente().getRazonSocial())
                        .build())
                .toList();

        List<BusquedaResponse.ResultadoCliente> clientes = clienteRepository
                .buscarActivos(termino, PageRequest.of(0, 5))
                .getContent()
                .stream()
                .map(c -> BusquedaResponse.ResultadoCliente.builder()
                        .id(c.getId())
                        .razonSocial(c.getRazonSocial())
                        .email(c.getEmail())
                        .tipo(c.getTipo())
                        .build())
                .toList();

        return BusquedaResponse.builder()
                .material(materiales)
                .eventos(eventos)
                .clientes(clientes)
                .build();
    }

    private boolean contieneIgnoreCase(String campo, String termino) {
        return campo != null && campo.toLowerCase().contains(termino.toLowerCase());
    }
}

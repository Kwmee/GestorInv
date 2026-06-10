package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.NegocioException;
import com.empresa.gestorinventario.exception.RecursoNoEncontradoException;
import com.empresa.gestorinventario.model.dto.request.ClienteRequest;
import com.empresa.gestorinventario.model.dto.response.ClienteResponse;
import com.empresa.gestorinventario.model.dto.response.EventoResponse;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.entity.Cliente;
import com.empresa.gestorinventario.repository.ClienteRepository;
import com.empresa.gestorinventario.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final EventoRepository eventoRepository;

    public PaginaResponse<ClienteResponse> listar(String busqueda, Pageable pageable) {
        Page<Cliente> pagina = clienteRepository.buscarActivos(busqueda, pageable);

        return PaginaResponse.<ClienteResponse>builder()
            .contenido(pagina.getContent().stream().map(this::toResponse).toList())
            .paginaActual(pagina.getNumber())
            .totalPaginas(pagina.getTotalPages())
            .totalElementos(pagina.getTotalElements())
            .primera(pagina.isFirst())
            .ultima(pagina.isLast())
            .build();
    }

    public ClienteResponse obtenerPorId(Long id) {
        return toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ClienteResponse crear(ClienteRequest request) {
        if (request.getNifCif() != null && !request.getNifCif().isBlank()
                && clienteRepository.existsByNifCif(request.getNifCif())) {
            throw new NegocioException("Ya existe un cliente con el NIF/CIF: " + request.getNifCif());
        }

        Cliente cliente = Cliente.builder()
            .razonSocial(request.getRazonSocial())
            .nifCif(request.getNifCif())
            .telefono(request.getTelefono())
            .email(request.getEmail())
            .direccion(request.getDireccion())
            .tipo(request.getTipo())
            .build();

        return toResponse(clienteRepository.save(cliente));
    }

    @Transactional
    public ClienteResponse actualizar(Long id, ClienteRequest request) {
        Cliente cliente = obtenerEntidad(id);

        if (request.getNifCif() != null && !request.getNifCif().isBlank()
                && !request.getNifCif().equals(cliente.getNifCif())
                && clienteRepository.existsByNifCif(request.getNifCif())) {
            throw new NegocioException("Ya existe un cliente con el NIF/CIF: " + request.getNifCif());
        }

        cliente.setRazonSocial(request.getRazonSocial());
        cliente.setNifCif(request.getNifCif());
        cliente.setTelefono(request.getTelefono());
        cliente.setEmail(request.getEmail());
        cliente.setDireccion(request.getDireccion());
        cliente.setTipo(request.getTipo());

        return toResponse(clienteRepository.save(cliente));
    }

    @Transactional
    public void desactivar(Long id) {
        Cliente cliente = obtenerEntidad(id);
        cliente.setActivo(false);
        clienteRepository.save(cliente);
    }

    public List<EventoResponse> obtenerEventos(Long id) {
        obtenerEntidad(id);
        return eventoRepository.findByClienteIdOrderByFechaInicioDesc(id).stream()
            .map(e -> EventoResponse.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .lugar(e.getLugar())
                .fechaInicio(e.getFechaInicio())
                .fechaFin(e.getFechaFin())
                .estado(e.getEstado())
                .build())
            .toList();
    }

    public Cliente obtenerEntidad(Long id) {
        return clienteRepository.findById(id)
            .filter(Cliente::getActivo)
            .orElseThrow(() -> new RecursoNoEncontradoException("Cliente", id));
    }

    private ClienteResponse toResponse(Cliente c) {
        return ClienteResponse.builder()
            .id(c.getId())
            .razonSocial(c.getRazonSocial())
            .nifCif(c.getNifCif())
            .telefono(c.getTelefono())
            .email(c.getEmail())
            .direccion(c.getDireccion())
            .tipo(c.getTipo())
            .activo(c.getActivo())
            .creadoEn(c.getCreadoEn())
            .build();
    }
}

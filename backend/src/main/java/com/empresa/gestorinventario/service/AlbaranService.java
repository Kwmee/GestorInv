package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.RecursoNoEncontradoException;
import com.empresa.gestorinventario.model.dto.request.DevolucionRequest;
import com.empresa.gestorinventario.model.dto.response.AlbaranResponse;
import com.empresa.gestorinventario.model.dto.response.PaginaResponse;
import com.empresa.gestorinventario.model.entity.Albaran;
import com.empresa.gestorinventario.model.entity.Evento;
import com.empresa.gestorinventario.model.entity.LineaEvento;
import com.empresa.gestorinventario.model.entity.Trabajador;
import com.empresa.gestorinventario.model.enums.TipoAlbaran;
import com.empresa.gestorinventario.repository.AlbaranRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlbaranService {

    private final AlbaranRepository albaranRepository;
    private final PdfService pdfService;

    public PaginaResponse<AlbaranResponse> listar(TipoAlbaran tipo, Long eventoId,
                                                   LocalDateTime fechaDesde, Pageable pageable) {
        Page<Albaran> pagina = albaranRepository.buscarConFiltros(tipo, eventoId, fechaDesde, pageable);

        return PaginaResponse.<AlbaranResponse>builder()
            .contenido(pagina.getContent().stream().map(this::toResponse).toList())
            .paginaActual(pagina.getNumber())
            .totalPaginas(pagina.getTotalPages())
            .totalElementos(pagina.getTotalElements())
            .primera(pagina.isFirst())
            .ultima(pagina.isLast())
            .build();
    }

    public AlbaranResponse obtenerPorId(Long id) {
        return toResponse(obtenerEntidad(id));
    }

    public byte[] obtenerPdf(Long id) {
        Albaran albaran = obtenerEntidad(id);
        return pdfService.leerPdf(albaran.getRutaPdf());
    }

    @Transactional
    public AlbaranResponse generarAlbaranSalida(Evento evento, Trabajador trabajador) {
        String numero = generarNumero(TipoAlbaran.SALIDA);
        String rutaPdf = pdfService.generarAlbaranSalida(evento, numero, trabajador);

        Albaran albaran = Albaran.builder()
            .evento(evento)
            .numero(numero)
            .tipo(TipoAlbaran.SALIDA)
            .trabajador(trabajador)
            .rutaPdf(rutaPdf)
            .build();

        return toResponse(albaranRepository.save(albaran));
    }

    @Transactional
    public AlbaranResponse generarAlbaranDevolucion(Evento evento,
            List<DevolucionRequest.LineaDevolucionRequest> lineasDevolucion,
            Trabajador trabajador) {
        String numero = generarNumero(TipoAlbaran.DEVOLUCION);

        List<LineaEvento> lineasDevueltas = evento.getLineas().stream()
            .filter(l -> lineasDevolucion.stream()
                .anyMatch(req -> req.getMaterialId().equals(l.getMaterial().getId())))
            .toList();

        String rutaPdf = pdfService.generarAlbaranDevolucion(evento, lineasDevueltas, numero, trabajador);

        Albaran albaran = Albaran.builder()
            .evento(evento)
            .numero(numero)
            .tipo(TipoAlbaran.DEVOLUCION)
            .trabajador(trabajador)
            .rutaPdf(rutaPdf)
            .build();

        return toResponse(albaranRepository.save(albaran));
    }

    private String generarNumero(TipoAlbaran tipo) {
        String prefijo = tipo == TipoAlbaran.SALIDA ? "SAL" : "DEV";
        int anio = Year.now().getValue();
        String prefijoConAnio = prefijo + "-" + anio + "-";

        return albaranRepository.findUltimoNumero(tipo, prefijoConAnio)
            .map(ultimo -> {
                int secuencia = Integer.parseInt(ultimo.substring(prefijoConAnio.length())) + 1;
                return String.format("%s%04d", prefijoConAnio, secuencia);
            })
            .orElse(prefijoConAnio + "0001");
    }

    private Albaran obtenerEntidad(Long id) {
        return albaranRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Albarán", id));
    }

    private AlbaranResponse toResponse(Albaran a) {
        return AlbaranResponse.builder()
            .id(a.getId())
            .numero(a.getNumero())
            .tipo(a.getTipo())
            .fechaEmision(a.getFechaEmision())
            .eventoId(a.getEvento().getId())
            .eventoNombre(a.getEvento().getNombre())
            .trabajadorNombre(a.getTrabajador() != null ? a.getTrabajador().getNombre() : null)
            .pdfUrl("/albaranes/" + a.getId() + "/pdf")
            .build();
    }
}

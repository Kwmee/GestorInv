package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.TipoAlbaran;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AlbaranResponse {

    private Long id;
    private String numero;
    private TipoAlbaran tipo;
    private LocalDateTime fechaEmision;
    private Long eventoId;
    private String eventoNombre;
    private String trabajadorNombre;
    private String pdfUrl;
}

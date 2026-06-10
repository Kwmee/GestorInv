package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.TipoCliente;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClienteResponse {

    private Long id;
    private String razonSocial;
    private String nifCif;
    private String telefono;
    private String email;
    private String direccion;
    private TipoCliente tipo;
    private Boolean activo;
    private LocalDateTime creadoEn;
}

package com.empresa.gestorinventario.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmpresaResponse {
    private String nombre;
    private String direccion;
    private String telefono;
    private String email;
    private boolean tieneLogo;
}

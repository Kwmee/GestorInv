package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.RolUsuario;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String email;
    private RolUsuario rol;
}

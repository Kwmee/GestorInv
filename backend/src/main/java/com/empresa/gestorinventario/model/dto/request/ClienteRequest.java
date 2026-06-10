package com.empresa.gestorinventario.model.dto.request;

import com.empresa.gestorinventario.model.enums.TipoCliente;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ClienteRequest {

    @NotBlank(message = "La razón social es obligatoria")
    @Size(max = 200)
    private String razonSocial;

    @Size(max = 15, message = "El NIF/CIF no puede superar 15 caracteres")
    private String nifCif;

    @Size(max = 20)
    private String telefono;

    @Email(message = "Formato de email no válido")
    @Size(max = 150)
    private String email;

    @Size(max = 300)
    private String direccion;

    private TipoCliente tipo = TipoCliente.EMPRESA;
}

package com.empresa.gestorinventario.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EmpresaRequest {

    @NotBlank(message = "El nombre de empresa es obligatorio")
    @Size(max = 200)
    private String nombre;

    @Size(max = 500)
    private String direccion;

    @Size(max = 50)
    private String telefono;

    @Email(message = "Formato de email no válido")
    @Size(max = 200)
    private String email;
}

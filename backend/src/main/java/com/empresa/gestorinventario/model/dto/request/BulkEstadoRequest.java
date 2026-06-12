// model/dto/request/BulkEstadoRequest.java
package com.empresa.gestorinventario.model.dto.request;

import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BulkEstadoRequest {

    @NotEmpty(message = "Debe especificar al menos un ID")
    private List<Long> ids;

    @NotNull(message = "El estado es obligatorio")
    private EstadoMaterial estado;

    private String observaciones;
}

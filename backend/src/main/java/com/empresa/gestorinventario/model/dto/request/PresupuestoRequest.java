// model/dto/request/PresupuestoRequest.java
package com.empresa.gestorinventario.model.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class PresupuestoRequest {

    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;

    private LocalDate fechaValidez;

    @Size(max = 2000, message = "La descripción no puede superar 2000 caracteres")
    private String descripcion;

    private String observaciones;

    @NotEmpty(message = "El presupuesto debe tener al menos una línea")
    private List<LineaRequest> lineas;

    @Data
    public static class LineaRequest {

        @NotNull(message = "El material es obligatorio")
        private Long materialId;

        @Min(value = 1, message = "La cantidad mínima es 1")
        private Integer cantidad;

        @NotNull(message = "El precio unitario es obligatorio")
        @DecimalMin(value = "0.0", message = "El precio no puede ser negativo")
        private BigDecimal precioUnitario;

        private String descripcion;
    }
}

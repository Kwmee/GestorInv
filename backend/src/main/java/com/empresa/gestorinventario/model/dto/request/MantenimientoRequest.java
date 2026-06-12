// model/dto/request/MantenimientoRequest.java
package com.empresa.gestorinventario.model.dto.request;

import com.empresa.gestorinventario.model.enums.EstadoMantenimiento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MantenimientoRequest {

    @NotNull(message = "El material es obligatorio")
    private Long materialId;

    @NotNull(message = "La fecha de entrada es obligatoria")
    private LocalDate fechaEntrada;

    private LocalDate fechaSalida;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 2000, message = "La descripción no puede superar 2000 caracteres")
    private String descripcion;

    @Size(max = 200, message = "El técnico externo no puede superar 200 caracteres")
    private String tecnicoExterno;

    @DecimalMin(value = "0.0", message = "El coste no puede ser negativo")
    private BigDecimal coste;

    private EstadoMantenimiento estado;

    private String observaciones;
}

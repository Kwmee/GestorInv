package com.empresa.gestorinventario.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventoRequest {

    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;

    private Long trabajadorId;

    @NotBlank(message = "El nombre del evento es obligatorio")
    @Size(max = 200)
    private String nombre;

    private String descripcion;

    @Size(max = 300)
    private String lugar;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFin;

    private String observaciones;

    private List<LineaMaterialRequest> lineas;

    @Data
    public static class LineaMaterialRequest {
        @NotNull(message = "El material es obligatorio")
        private Long materialId;

        @Min(value = 1, message = "La cantidad mínima es 1")
        private Integer cantidad = 1;

        private String observaciones;
    }
}

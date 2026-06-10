package com.empresa.gestorinventario.model.dto.request;

import com.empresa.gestorinventario.model.enums.EstadoDevolucion;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class DevolucionRequest {

    @NotEmpty(message = "Debe incluir al menos una línea de devolución")
    private List<LineaDevolucionRequest> lineas;

    @Data
    public static class LineaDevolucionRequest {

        @NotNull(message = "El material es obligatorio")
        private Long materialId;

        @NotNull(message = "El estado de devolución es obligatorio")
        private EstadoDevolucion estadoDevolucion;

        private String observaciones;
    }
}

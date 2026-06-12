// model/dto/response/MantenimientoResponse.java
package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.EstadoMantenimiento;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MantenimientoResponse {

    private Long id;
    private MaterialInfo material;
    private LocalDate fechaEntrada;
    private LocalDate fechaSalida;
    private String descripcion;
    private String tecnicoExterno;
    private BigDecimal coste;
    private EstadoMantenimiento estado;
    private String observaciones;
    private LocalDateTime creadoEn;

    @Data
    @Builder
    public static class MaterialInfo {
        private Long id;
        private String nombre;
        private String marca;
        private String modelo;
    }
}

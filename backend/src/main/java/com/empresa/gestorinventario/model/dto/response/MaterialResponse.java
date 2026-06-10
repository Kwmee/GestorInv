package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MaterialResponse {

    private Long id;
    private CategoriaInfo categoria;
    private String nombre;
    private String descripcion;
    private String marca;
    private String modelo;
    private String numeroSerie;
    private Integer cantidad;
    private EstadoMaterial estado;
    private BigDecimal valorUnitario;
    private LocalDate fechaAdquisicion;
    private Boolean esFungible;
    private Integer stockMinimo;
    private String observaciones;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;

    @Data
    @Builder
    public static class CategoriaInfo {
        private Long id;
        private String nombre;
    }
}

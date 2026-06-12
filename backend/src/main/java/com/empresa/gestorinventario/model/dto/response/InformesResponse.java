// model/dto/response/InformesResponse.java
package com.empresa.gestorinventario.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InformesResponse {

    private ResumenMaterial resumenMaterial;
    private List<CategoriaStats> materialPorCategoria;
    private List<MesStats> eventosPorMes;
    private List<MaterialUsado> top5MaterialUsado;
    private ResumenEventos resumenEventos;
    private ResumenMantenimiento resumenMantenimiento;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResumenMaterial {
        private long totalItems;
        private long disponible;
        private long enEvento;
        private long enReparacion;
        private long baja;
        private BigDecimal valorTotal;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoriaStats {
        private String categoria;
        private long total;
        private long disponible;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MesStats {
        private String mes;
        private long total;
        private long finalizados;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MaterialUsado {
        private String nombre;
        private String categoria;
        private long vecesEnEventos;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResumenEventos {
        private long total;
        private long planificados;
        private long activos;
        private long finalizados;
        private long cancelados;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResumenMantenimiento {
        private long enRevision;
        private long reparando;
        private long reparados;
        private long irreparables;
    }
}

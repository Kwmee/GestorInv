// model/dto/response/PresupuestoResponse.java
package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.EstadoPresupuesto;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PresupuestoResponse {

    private Long id;
    private String numero;
    private ClienteInfo cliente;
    private LocalDate fechaEmision;
    private LocalDate fechaValidez;
    private EstadoPresupuesto estado;
    private String descripcion;
    private String observaciones;
    private List<LineaInfo> lineas;
    private BigDecimal total;
    private LocalDateTime creadoEn;

    @Data
    @Builder
    public static class ClienteInfo {
        private Long id;
        private String razonSocial;
    }

    @Data
    @Builder
    public static class LineaInfo {
        private Long id;
        private Long materialId;
        private String materialNombre;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
        private String descripcion;
    }
}

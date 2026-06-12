package com.empresa.gestorinventario.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {

    private Long totalMaterial;
    private Long disponible;
    private Long enEvento;
    private Long enReparacion;
    private Long baja;
    private Long eventosActivos;
    private Long materialPendienteDevolucion;
    private List<EventoActivoInfo> eventosActivosDetalle;
    private List<AlertaDevolucion> alertasDevolucion;

    @Data
    @Builder
    public static class EventoActivoInfo {
        private Long id;
        private String nombre;
        private String cliente;
        private String fechaInicio;
        private Long materialPendiente;
    }

    @Data
    @Builder
    public static class AlertaDevolucion {
        private Long id;
        private String nombre;
        private String cliente;
        private String fechaFin;
        private Long diasRetraso;
        private Long materialPendiente;
    }
}

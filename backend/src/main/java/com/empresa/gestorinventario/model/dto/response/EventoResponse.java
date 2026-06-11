package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.EstadoDevolucion;
import com.empresa.gestorinventario.model.enums.EstadoEvento;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EventoResponse {

    private Long id;
    private ClienteInfo cliente;
    private TrabajadorInfo trabajador;
    private String nombre;
    private String descripcion;
    private String lugar;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private EstadoEvento estado;
    private String observaciones;
    private List<LineaEventoInfo> lineas;
    private LocalDateTime creadoEn;

    @Data
    @Builder
    public static class ClienteInfo {
        private Long id;
        private String razonSocial;
        private String nifCif;
        private String telefono;
        private String email;
        private String direccion;
    }

    @Data
    @Builder
    public static class TrabajadorInfo {
        private Long id;
        private String nombre;
    }

    @Data
    @Builder
    public static class LineaEventoInfo {
        private Long id;
        private Long materialId;
        private String materialNombre;
        private String materialNumeroSerie;
        private Integer cantidad;
        private EstadoDevolucion estadoDevolucion;
        private String observaciones;
    }
}

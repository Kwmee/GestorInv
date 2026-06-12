// model/dto/response/BusquedaResponse.java
package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.EstadoEvento;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import com.empresa.gestorinventario.model.enums.TipoCliente;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BusquedaResponse {

    private List<ResultadoMaterial> material;
    private List<ResultadoEvento> eventos;
    private List<ResultadoCliente> clientes;

    @Data
    @Builder
    public static class ResultadoMaterial {
        private Long id;
        private String nombre;
        private String marca;
        private EstadoMaterial estado;
        private String categoriaNombre;
    }

    @Data
    @Builder
    public static class ResultadoEvento {
        private Long id;
        private String nombre;
        private String lugar;
        private EstadoEvento estado;
        private String clienteNombre;
    }

    @Data
    @Builder
    public static class ResultadoCliente {
        private Long id;
        private String razonSocial;
        private String email;
        private TipoCliente tipo;
    }
}

package com.empresa.gestorinventario.model.dto.response;

import com.empresa.gestorinventario.model.enums.EstadoChecklistItem;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ChecklistItemResponse {
    private Long id;
    private Long materialId;
    private String materialNombre;
    private String materialNumeroSerie;
    private String materialCategoria;
    private Integer cantidadPlanificada;
    private Integer cantidadCargada;
    private EstadoChecklistItem estado;
    private String notas;
    private LocalDateTime confirmadoEn;
}

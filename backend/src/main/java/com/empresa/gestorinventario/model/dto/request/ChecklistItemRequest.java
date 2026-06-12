package com.empresa.gestorinventario.model.dto.request;

import com.empresa.gestorinventario.model.enums.EstadoChecklistItem;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChecklistItemRequest {
    @NotNull
    private EstadoChecklistItem estado;

    @Min(0)
    private Integer cantidadCargada;

    private String notas;
}

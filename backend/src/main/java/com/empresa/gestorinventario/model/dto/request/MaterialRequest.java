package com.empresa.gestorinventario.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MaterialRequest {

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200, message = "El nombre no puede superar 200 caracteres")
    private String nombre;

    private String descripcion;

    @Size(max = 100)
    private String marca;

    @Size(max = 100)
    private String modelo;

    @Size(max = 150, message = "El número de serie no puede superar 150 caracteres")
    private String numeroSerie;

    @Min(value = 1, message = "La cantidad mínima es 1")
    private Integer cantidad = 1;

    @DecimalMin(value = "0.0", message = "El valor no puede ser negativo")
    private BigDecimal valorUnitario;

    private LocalDate fechaAdquisicion;

    private Boolean esFungible = false;

    @Min(value = 0, message = "El stock mínimo no puede ser negativo")
    private Integer stockMinimo = 0;

    private String observaciones;
}

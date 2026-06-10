package com.empresa.gestorinventario.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuracion_empresa")
@Getter @Setter @NoArgsConstructor
public class EmpresaConfiguracion {

    @Id
    private Long id = 1L;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(length = 500)
    private String direccion;

    @Column(length = 50)
    private String telefono;

    @Column(length = 200)
    private String email;

    @Column(name = "logo_path", length = 500)
    private String logoPath;
}

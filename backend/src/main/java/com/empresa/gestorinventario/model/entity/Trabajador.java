package com.empresa.gestorinventario.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trabajadores")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trabajador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}

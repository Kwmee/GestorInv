package com.empresa.gestorinventario.model.entity;

import com.empresa.gestorinventario.model.enums.EstadoDevolucion;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lineas_evento",
    uniqueConstraints = @UniqueConstraint(columnNames = {"evento_id", "material_id"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineaEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(nullable = false)
    @Builder.Default
    private Integer cantidad = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_devolucion", nullable = false, length = 20)
    @Builder.Default
    private EstadoDevolucion estadoDevolucion = EstadoDevolucion.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}

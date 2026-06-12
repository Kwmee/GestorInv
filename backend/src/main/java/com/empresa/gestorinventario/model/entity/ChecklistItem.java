package com.empresa.gestorinventario.model.entity;

import com.empresa.gestorinventario.model.enums.EstadoChecklistItem;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "checklist_carga",
    uniqueConstraints = @UniqueConstraint(columnNames = {"evento_id", "material_id"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "cantidad_planificada", nullable = false)
    private Integer cantidadPlanificada;

    @Column(name = "cantidad_cargada")
    private Integer cantidadCargada;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoChecklistItem estado = EstadoChecklistItem.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(name = "confirmado_en")
    private LocalDateTime confirmadoEn;
}

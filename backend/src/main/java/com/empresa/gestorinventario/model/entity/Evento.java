package com.empresa.gestorinventario.model.entity;

import com.empresa.gestorinventario.model.enums.EstadoEvento;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "eventos")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trabajador_id")
    private Trabajador trabajador;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 300)
    private String lugar;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoEvento estado = EstadoEvento.PLANIFICADO;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LineaEvento> lineas = new ArrayList<>();

    @OneToMany(mappedBy = "evento", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Albaran> albaranes = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime actualizadoEn;
}

package com.empresa.gestorinventario.model.enums;

public enum EstadoEvento {
    PLANIFICADO,   // Lista de material preparada
    EN_CARGA,      // Cargando el camión (checklist activo)
    ACTIVO,        // Camión en ruta / en el evento
    DEVOLVIENDO,   // Material volviendo a la nave
    FINALIZADO,
    CANCELADO
}

package com.empresa.gestorinventario.exception;

public class MaterialNoDisponibleException extends RuntimeException {

    public MaterialNoDisponibleException(String nombre, String estado) {
        super("El material '" + nombre + "' no está disponible (estado actual: " + estado + ")");
    }
}

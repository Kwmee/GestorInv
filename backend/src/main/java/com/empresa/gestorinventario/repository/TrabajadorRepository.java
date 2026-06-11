package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrabajadorRepository extends JpaRepository<Trabajador, Long> {
    List<Trabajador> findByActivoTrueOrderByNombreAsc();
}

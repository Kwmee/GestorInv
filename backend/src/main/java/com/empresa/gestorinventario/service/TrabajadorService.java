package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.RecursoNoEncontradoException;
import com.empresa.gestorinventario.model.entity.Trabajador;
import com.empresa.gestorinventario.repository.TrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TrabajadorService {

    private final TrabajadorRepository trabajadorRepository;

    public List<Trabajador> listar() {
        return trabajadorRepository.findByActivoTrueOrderByNombreAsc();
    }

    @Transactional
    public Trabajador crear(String nombre) {
        return trabajadorRepository.save(Trabajador.builder().nombre(nombre.trim()).build());
    }

    @Transactional
    public void desactivar(Long id) {
        Trabajador t = trabajadorRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Trabajador", id));
        t.setActivo(false);
        trabajadorRepository.save(t);
    }

    public Trabajador obtenerEntidad(Long id) {
        return trabajadorRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Trabajador", id));
    }
}

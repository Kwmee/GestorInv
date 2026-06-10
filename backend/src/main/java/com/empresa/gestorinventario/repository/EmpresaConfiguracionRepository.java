package com.empresa.gestorinventario.repository;

import com.empresa.gestorinventario.model.entity.EmpresaConfiguracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaConfiguracionRepository extends JpaRepository<EmpresaConfiguracion, Long> {}

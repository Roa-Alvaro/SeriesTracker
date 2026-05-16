package com.alvaro.seriestracker.repositories;

import com.alvaro.seriestracker.entities.SeguimientoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeguimientoRepository extends JpaRepository<SeguimientoEntity, Long> {
    List<SeguimientoEntity> findByUsuarioId(Long usuarioId);
    List<SeguimientoEntity> findByEstado(String estado);
    boolean existsByUsuarioIdAndSerieTitulo(Long usuarioId, String titulo);
    Optional<SeguimientoEntity> findByUsuarioIdAndSerieId(Long id, Long id1);

    boolean existsByUsuarioIdAndSerieId(Long id, Long id1);
}
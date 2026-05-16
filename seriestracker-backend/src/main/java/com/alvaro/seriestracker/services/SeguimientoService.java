package com.alvaro.seriestracker.services;

import com.alvaro.seriestracker.entities.SeguimientoEntity;
import com.alvaro.seriestracker.repositories.SeguimientoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeguimientoService {

    private final SeguimientoRepository seguimientoRepository;

    public SeguimientoService(SeguimientoRepository seguimientoRepository) {
        this.seguimientoRepository = seguimientoRepository;
    }

    public SeguimientoEntity guardarSeguimiento(SeguimientoEntity seguimiento) {
        return seguimientoRepository.save(seguimiento);
    }

    public List<SeguimientoEntity> obtenerPorUsuario(Long usuarioId) {
        return seguimientoRepository.findByUsuarioId(usuarioId);
    }
    public SeguimientoEntity guardarOActualizar(SeguimientoEntity nuevoDatos) {
        Optional<SeguimientoEntity> existente = seguimientoRepository
                .findByUsuarioIdAndSerieId(nuevoDatos.getUsuario().getId(), nuevoDatos.getSerie().getId());

        if (existente.isPresent()) {
            SeguimientoEntity aActualizar = existente.get();
            aActualizar.setCapituloActual(nuevoDatos.getCapituloActual());
            aActualizar.setTemporadaActual(nuevoDatos.getTemporadaActual());
            aActualizar.setEstado(nuevoDatos.getEstado());
            aActualizar.setNota(nuevoDatos.getNota());
            return seguimientoRepository.save(aActualizar);
        }

        return seguimientoRepository.save(nuevoDatos);
    }

    public boolean eliminarSeguimiento(Long id, Long userId) {
        return seguimientoRepository.findById(id).map(seguimiento -> {
            if (seguimiento.getUsuario().getId().equals(userId)) {
                seguimientoRepository.delete(seguimiento);
                return true;
            }
            return false;
        }).orElse(false);
    }
}

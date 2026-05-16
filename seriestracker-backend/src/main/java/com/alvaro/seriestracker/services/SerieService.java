package com.alvaro.seriestracker.services;

import com.alvaro.seriestracker.entities.SerieEntity;
import com.alvaro.seriestracker.repositories.SerieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SerieService {

    private final SerieRepository serieRepository;

    public SerieService(SerieRepository serieRepository) {
        this.serieRepository = serieRepository;
    }

    public SerieEntity guardarSerie(SerieEntity serie) {
        return serieRepository.save(serie);
    }

    public List<SerieEntity> obtenerTodas() {
        return serieRepository.findAll();
    }
}
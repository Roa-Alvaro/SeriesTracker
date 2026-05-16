package com.alvaro.seriestracker.repositories;

import com.alvaro.seriestracker.entities.SerieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SerieRepository extends JpaRepository<SerieEntity, Long> {
    Optional<SerieEntity> findByTitulo(String titulo);

    Optional<SerieEntity> findByTmdbId(long tmdbId);
}
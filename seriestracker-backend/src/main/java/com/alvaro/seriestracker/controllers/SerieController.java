package com.alvaro.seriestracker.controllers;

import com.alvaro.seriestracker.entities.SerieEntity;
import com.alvaro.seriestracker.entities.UserEntity;
import com.alvaro.seriestracker.repositories.SeguimientoRepository;
import com.alvaro.seriestracker.repositories.SerieRepository;
import com.alvaro.seriestracker.repositories.UserRepository;
import com.alvaro.seriestracker.services.SerieService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
public class SerieController {

    private final SerieService serieService;
    private final SerieRepository serieRepository;
    private final UserRepository userRepository;
    private final SeguimientoRepository seguimientoRepository;

    public SerieController(SerieService serieService, SerieRepository serieRepository, UserRepository userRepository,SeguimientoRepository seguimientoRepository) {
        this.serieService = serieService;
        this.serieRepository = serieRepository;
        this.userRepository =userRepository;
        this.seguimientoRepository = seguimientoRepository;
    }

    @PostMapping
    public ResponseEntity<SerieEntity> guardarSerie(@RequestBody SerieEntity serie) {
        return ResponseEntity.ok(serieService.guardarSerie(serie));
    }

    @GetMapping
    public ResponseEntity<List<SerieEntity>> obtenerTodas() {
        return ResponseEntity.ok(serieService.obtenerTodas());
    }
    // En SerieController.java

    @GetMapping("/mis-series")
    public ResponseEntity<?> getMisSeries(Authentication authentication) {
        // Spring Security saca el nombre del usuario directamente de la sesión
        String username = authentication.getName();
        UserEntity user = userRepository.findByUsername(username).get();

        return ResponseEntity.ok(seguimientoRepository.findByUsuarioId(user.getId()));
    }
}
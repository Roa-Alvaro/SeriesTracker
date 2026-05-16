package com.alvaro.seriestracker.controllers;

import com.alvaro.seriestracker.entities.SeguimientoEntity;
import com.alvaro.seriestracker.entities.SerieEntity;
import com.alvaro.seriestracker.entities.UserEntity;
import com.alvaro.seriestracker.repositories.SeguimientoRepository;
import com.alvaro.seriestracker.repositories.SerieRepository;
import com.alvaro.seriestracker.repositories.UserRepository;
import com.alvaro.seriestracker.security.UserPrincipal;
import com.alvaro.seriestracker.services.SeguimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@RestController
@RequestMapping("/api/seguimientos")
public class SeguimientoController {
    @Autowired
    private SeguimientoService seguimientoService;
    private final UserRepository userRepository;
    private final SerieRepository serieRepository;
    private final SeguimientoRepository seguimientoRepository;

    public SeguimientoController(UserRepository userRepository, SerieRepository serieRepository, SeguimientoRepository seguimientoRepository) {
        this.userRepository = userRepository;
        this.serieRepository = serieRepository;
        this.seguimientoRepository = seguimientoRepository;
    }

    @GetMapping("/mis-seguimientos")
    public ResponseEntity<?> getMisSeguimientos(Authentication auth) {
        UserEntity usuario = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        List<SeguimientoEntity> seguimientos = seguimientoRepository.findByUsuarioId(usuario.getId());
        return ResponseEntity.ok(seguimientos);
    }

    @PostMapping
    public ResponseEntity<?> crearSeguimiento(@RequestBody SeguimientoEntity seguimiento, Authentication auth) {
        try {
            UserEntity usuario = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            seguimiento.setUsuario(usuario);

            if (seguimientoRepository.existsByUsuarioIdAndSerieId(usuario.getId(), seguimiento.getSerie().getId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya sigues esta serie");
            }

            seguimientoRepository.save(seguimiento);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error interno al crear seguimiento");
        }
    }

    @PostMapping("/importar")
    public ResponseEntity<?> importarSerie(@RequestBody SerieEntity nuevaSerie, Authentication auth) {
        UserEntity usuario = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        SerieEntity serieFinal = serieRepository.findByTmdbId(nuevaSerie.getTmdbId())
                .orElseGet(() -> serieRepository.save(nuevaSerie));

        if (seguimientoRepository.existsByUsuarioIdAndSerieId(usuario.getId(), serieFinal.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya sigues esta serie");
        }

        SeguimientoEntity seguimiento = new SeguimientoEntity();
        seguimiento.setUsuario(usuario);
        seguimiento.setSerie(serieFinal);
        seguimiento.setEstado("VIENDO");
        seguimiento.setCapituloActual(1);
        seguimiento.setTemporadaActual(1);

        seguimientoRepository.save(seguimiento);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<SeguimientoEntity> getDetalle(@PathVariable Long id) {
        return seguimientoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<SeguimientoEntity> actualizarSeguimiento(@PathVariable Long id, @RequestBody SeguimientoEntity detallesActualizados) {
        return seguimientoRepository.findById(id)
                .map(seg -> {
                    seg.setTemporadaActual(detallesActualizados.getTemporadaActual());
                    seg.setCapituloActual(detallesActualizados.getCapituloActual());
                    seg.setEstado(detallesActualizados.getEstado());
                    return ResponseEntity.ok(seguimientoRepository.save(seg));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserPrincipal) {
            Long userId = ((UserPrincipal) principal).getId();
            boolean eliminado = seguimientoService.eliminarSeguimiento(id, userId);
            return eliminado ? ResponseEntity.ok().build() : ResponseEntity.status(403).build();
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No hay sesión activa");
    }
}
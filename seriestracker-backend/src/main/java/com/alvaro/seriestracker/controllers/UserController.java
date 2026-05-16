package com.alvaro.seriestracker.controllers;

import com.alvaro.seriestracker.entities.UserEntity;
import com.alvaro.seriestracker.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/registro")
    public ResponseEntity<UserEntity> registrarUsuario(@RequestBody UserEntity usuario) {
        UserEntity nuevoUsuario = userService.registrarUsuario(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserEntity> obtenerUsuarioPorEmail(@PathVariable String email) {
        Optional<UserEntity> usuario = userService.buscarPorEmail(email);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
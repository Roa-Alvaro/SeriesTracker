package com.alvaro.seriestracker.services;

import com.alvaro.seriestracker.entities.UserEntity;
import com.alvaro.seriestracker.repositories.UserRepository;
import com.alvaro.seriestracker.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

    return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getPassword(),
            new ArrayList<>()
    );
    }

    public UserService(UserRepository userRepository) {

        this.userRepository = userRepository;

    }



    public UserEntity registrarUsuario(UserEntity usuario) {

        return userRepository.save(usuario);

    }



    public Optional<UserEntity> buscarPorEmail(String email) {

        return userRepository.findByEmail(email);

    }
}
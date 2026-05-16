package com.alvaro.seriestracker.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "seguimientos")
public class SeguimientoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserEntity usuario;

    @ManyToOne
    @JoinColumn(name = "serie_id", nullable = false)
    private SerieEntity serie;

    private String estado; // Ej: "VIENDO", "COMPLETADA", "PENDIENTE"

    private Integer temporadaActual = 1;

    private Integer capituloActual = 0;

    private Integer nota;

    public SeguimientoEntity() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserEntity getUsuario() { return usuario; }
    public void setUsuario(UserEntity usuario) { this.usuario = usuario; }

    public SerieEntity getSerie() { return serie; }
    public void setSerie(SerieEntity serie) { this.serie = serie; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Integer getTemporadaActual() { return temporadaActual; }
    public void setTemporadaActual(Integer temporadaActual) { this.temporadaActual = temporadaActual; }

    public Integer getCapituloActual() { return capituloActual; }
    public void setCapituloActual(Integer capituloActual) { this.capituloActual = capituloActual; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
}
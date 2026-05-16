package com.alvaro.seriestracker.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "series")
public class SerieEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String sinopsis;

    private String plataforma; // Ej: Netflix, HBO, etc.

    private Integer anio;
    private String posterUrl;
    private Long tmdbId;

    public SerieEntity() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    @Column(columnDefinition = "TEXT")
    public String getSinopsis() { return sinopsis; }
    public void setSinopsis(String sinopsis) { this.sinopsis = sinopsis; }

    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }

    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }

    public String getPosterUrl(){return posterUrl;}
    public void setPosterUrl(String posterUrl){this.posterUrl=posterUrl;}

    public long getTmdbId(){return tmdbId;}
    public void setTmdbId(Long tmdbId){this.tmdbId=tmdbId;}


}

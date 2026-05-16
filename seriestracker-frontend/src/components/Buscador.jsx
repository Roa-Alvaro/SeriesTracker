import { useState, useEffect ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './Buscador.css';
import { AuthContext} from '../context/AuthContext';

export const Buscador = () => {
    const { user } = useContext(AuthContext); 
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState([]);
    const [misSeriesIds, setMisSeriesIds] = useState([]); 
    const navigate = useNavigate();
    const [serieSeleccionada, setSerieSeleccionada] = useState(null);


useEffect(() => {
        fetch('http://localhost:8080/api/seguimientos/mis-seguimientos', { 
            credentials: 'include' 
        })
            .then(res => {
                if (!res.ok) throw new Error("No autorizado o sesión caducada");
                return res.json();
            })
            .then(data => {
                const ids = data.map(s => Number(s.serie.tmdbId));
                setMisSeriesIds(ids);
            })
            .catch(err => console.error("Error al obtener tus series:", err));
    }, [])

    const buscarSeries = async (e) => {
        e.preventDefault();
        console.log("Buscando serie:", query);
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&language=es-ES`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setResultados(data.results || []);
        } catch (error) {
            console.error("Error en la API de TMDB:", error);
        }
    };

    const añadirASeguimiento = async (serieTMDB) => {
        if (!user) {
            navigate('/login');
            return; 
        }
        const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
  }
};
const url = `https://api.themoviedb.org/3/tv/${serieTMDB.id}/watch/providers`;
        try{

       const resProviders = await fetch(url, options);
        const dataProviders = await resProviders.json();
        
        const providersES = dataProviders.results?.ES?.flatrate;
        const nombrePlataforma = providersES ? providersES[0].provider_name : "No disponible";
        const datosParaEnviar = {
            titulo: serieTMDB.name,
            posterUrl: serieTMDB.poster_path 
                ? `https://image.tmdb.org/t/p/w500${serieTMDB.poster_path}` 
                : null,
            tmdbId: serieTMDB.id, 
            sinopsis: serieTMDB.overview,
            anio: serieTMDB.first_air_date ? parseInt(serieTMDB.first_air_date.substring(0, 4)) : null,
            plataforma: nombrePlataforma
        };
    
            const res = await fetch('http://localhost:8080/api/seguimientos/importar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(datosParaEnviar)
            });

            if (res.ok) {
                console.log("Serie añadida correctamente!");
                setMisSeriesIds(prev => [...prev, Number(serieTMDB.id)]);
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <div className="buscador-container">
            <form onSubmit={buscarSeries} className="buscador-form">
                <input 
                    className="buscador-input"
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Escribe el nombre de una serie..."
                />
                <button type="submit" className="btn-accion btn-añadir">
                    Buscar
                </button>
            </form>

            <div className="buscador-grid">
                {resultados.map(serie => {
                    const yaLaTengo = misSeriesIds.includes(Number(serie.id));

                    return (
                        <div key={serie.id} className={`serie-card ${yaLaTengo ? 'ya-tengo' : ''}`}>
                            <img 
                                className="serie-img"
                                src={serie.poster_path 
                                    ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` 
                                    : 'https://placehold.co/500x750/222/white?text=Sin+Imagen'} 
                                alt={serie.name}
                                onClick={() => {
        console.log("Abriendo modal de:", serie.name); 
        setSerieSeleccionada(serie);
    }} 
    style={{ cursor: 'pointer' }}
                            />
                            <div className="serie-info">
                                <h4 className="serie-titulo">{serie.name}</h4>
                                <button 
                                    onClick={() => añadirASeguimiento(serie)}
                                    disabled={yaLaTengo}
                                    className={`btn-accion ${yaLaTengo ? 'btn-desactivado' : 'btn-añadir'}`}
                                >
                                    {yaLaTengo ? '✓ En tu lista' : 'Añadir'}
                                </button>
                            </div>
                        </div>
                        
                    );
                })}
            </div>
        
        {serieSeleccionada && (
                <div className="modal-overlay" onClick={() => setSerieSeleccionada(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSerieSeleccionada(null)}>×</button>
                        
                        <div className="modal-body">
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${serieSeleccionada.poster_path}`} 
                                alt="poster" 
                            />
                            
                            <div className="modal-info">
                                <h2>{serieSeleccionada.name}</h2>
                                <p className="modal-sinopsis">
                                    {serieSeleccionada.overview || "Sin sinopsis disponible."}
                                </p>
                                
                                <button 
                                    className="btn-accion btn-añadir"
                                    disabled={misSeriesIds.includes(Number(serieSeleccionada.id))}
                                    onClick={() => {
                                        añadirASeguimiento(serieSeleccionada);
                                        setSerieSeleccionada(null);
                                    }}
                                >
                                    {misSeriesIds.includes(Number(serieSeleccionada.id)) 
                                        ? '✓ Ya está en tu lista' 
                                        : '+ Añadir a mi seguimiento'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
    );
};
import { useState, useEffect } from 'react';
import './MisSeries.css'; 
import { Link } from 'react-router-dom';

export default function MisSeries() {
  const [seguimientos, setSeguimientos] = useState([]);
  

  

  const cargarMisSeries = () => {
    fetch(`http://localhost:8080/api/seguimientos/mis-seguimientos`, {
        method: 'GET',
        credentials: 'include' 
    })
      .then(res => {
          if (res.status === 403) throw new Error("No tienes permiso o sesión caducada");
          return res.json();
      })
      .then(datos => {
        if (Array.isArray(datos)) {
            setSeguimientos(datos);
        }
      })
      .catch(err => console.error("Error al cargar:", err));
  };
const eliminarSerie = async (e, seguimientoId) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (!window.confirm("¿Seguro que quieres quitar esta serie?")) return;

    try {
        const res = await fetch(`http://localhost:8080/api/seguimientos/eliminar/${seguimientoId}`, {
            method: 'DELETE',
            credentials: 'include' 
        });

        if (res.ok) {
            // CAMBIO: Usamos setSeguimientos porque 'series' no existe
            setSeguimientos(prev => prev.filter(s => s.id !== seguimientoId));
        } else {
            alert("Error al borrar");
        }
    } catch (error) {
        console.error(error);
    }
};
     

  useEffect(() => {
    cargarMisSeries();
  }, []);

  const sumarCapitulo = (seguimiento) => {
    const seguimientoActualizado = { ...seguimiento, capituloActual: seguimiento.capituloActual + 1 };

    fetch('http://localhost:8080/api/seguimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // FUNDAMENTAL: También en los POST para que el backend te reconozca
      credentials: 'include', 
      body: JSON.stringify(seguimientoActualizado)
    })
    .then(res => {
      if(res.ok) cargarMisSeries();
      else console.error("Error al actualizar capitulo");
    })
    .catch(err => console.error("Error al actualizar:", err));
  };
return(
<div className="mis-series-container">
      <h2 className="page-title">Mi Biblioteca de Series</h2>
      
      {seguimientos.length === 0 ? (
        <p className="empty-msg">Aún no sigues ninguna serie. ¡Ve al catálogo y añade algunas!</p>
      ) : (
        <div className="series-grid">
          {seguimientos.map(seg => (
            <Link key={seg.id} to={`/serie/${seg.id}`} className="serie-card-tracker">
              <div className={`serie-card-tracker ${
    seg.estado === 'FINALIZADA' ? 'estado-finalizada' : 
    seg.estado === 'PENDIENTE' ? 'estado-pendiente' : 'estado-viendo'
}`}>
              
              <div className="poster-container">
                <img 
                  src={seg.serie?.posterUrl || 'https://placehold.co/500x750?text=Sin+Imagen'} 
                  alt={seg.serie?.titulo} 
                  className="serie-poster-img"
                />
              </div>

              <div className="serie-info-content">
                <h3 className="serie-full-title">{seg.serie?.titulo} </h3>



                <div className="status-badge-container">
                    <span className="status-text">
                      <span className={`estado-badge-rect ${seg.estado?.toLowerCase()}`}>
    {seg.estado}
</span>
                    </span>
                </div>


              </div>                <div className="serie-actions">
                            {/* Botón de eliminar con estilo peligro */}
                            <button 
                                className="btn-delete" 
onClick={(e) => eliminarSerie(e, seg.id)}                             >
                                🗑️ Eliminar
                            </button>
                        </div>


            </div>
            </Link>
          ))}
        </div>
      )}
    </div>  
);
}
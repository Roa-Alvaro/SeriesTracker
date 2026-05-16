import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./DetalleSerie.css"

export default function DetalleSerie() {
  const { id } = useParams();
  const [seg, setSeg] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/seguimientos/${id}`,{credentials: 'include'})
      .then(res => res.json())
      .then(datos => {
        console.log("Datos de la serie recibidos:", datos); // Revisa la consola del navegador
        setSeg(datos);
      })
      .catch(err => console.error("Error al cargar la ficha:", err));
  }, [id]);
// 1. Función para cambiar los números localmente
  const updateProgress = (campo, valor) => {
    setSeg(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // 2. Función para enviar los cambios al servidor (Java)
 const handleSave = async () => {
  try {
    const res = await fetch(`http://localhost:8080/api/seguimientos/${id}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(seg)
    });

    if (res.ok) {
      alert("¡Cambios guardados con éxito!");
    } else if (res.status === 409) {
      alert("Error de conflicto: El registro ya existe.");
    }
  } catch (error) {
    console.error("Error en la petición:", error);
  }
  // Dentro de tu componente DetalleSerie, antes del return:

const updateProgress = (campo, nuevoValor) => {
    console.log(`Actualizando ${campo} a: ${nuevoValor}`); // Debug para DAW
    
    setSeg(prevSeg => ({
        ...prevSeg,      // Copiamos todo lo que había antes
        [campo]: nuevoValor // Sobrescribimos SOLO el campo que ha cambiado
    }));
};
};
  if (!seg) return <h2 style={{ padding: '20px' }}>Cargando serie...</h2>;

  return (
  <div className="detalle-main-wrapper">
    {/* Fondo desenfocado con el póster de la serie */}
    <div 
      className="detalle-backdrop" 
      style={{ backgroundImage: `url(${seg.serie?.posterUrl})` }}
    ></div>

    <div className="detalle-container">
      {/* Columna Izquierda: Imagen fija */}
      <div className="detalle-poster-side">
        <img 
          src={seg.serie?.posterUrl || 'https://via.placeholder.com/500x750'} 
          alt={seg.serie?.titulo} 
          className="main-poster-img"
        />
        <div className="platform-pill">{seg.serie?.plataforma}</div>
      </div>

      {/* Columna Derecha: Información y Gestión */}
      <div className="detalle-info-side">
        <header className="info-header">
          <h1>{seg.serie?.titulo} <span className="anio-tag">({seg.serie?.anio})</span></h1>
          <div className="tags-row">
            <span className={`status-badge ${
              seg.estado === 'FINALIZADA' ? 'red' : 
    seg.estado === 'PENDIENTE' ? 'yellow' : 'green'}`}>
              {seg.estado}
            </span>
          </div>
        </header>

        <section className="sinopsis-section">
          <h3>Sinopsis</h3>
          <p>{seg.serie?.sinopsis || "No hay sinopsis disponible para esta serie."}</p>
        </section>

        {/* TARJETA DE GESTIÓN (Tus datos personales) */}
        <section className="tracker-card">
          <div className="tracker-header">
            <h4>Tu Progreso Personal</h4>
          </div>
          
          <div className="tracker-grid">
  {/* Temporada */}
<div className="counter-control">
  <button onClick={() => updateProgress('temporadaActual', Math.max(1, seg.temporadaActual - 1))}>-</button>
  <span>{seg.temporadaActual}</span>
  <button onClick={() => updateProgress('temporadaActual', seg.temporadaActual + 1)}>+</button>
</div>

{/* Capítulo */}
<div className="counter-control">
  <button onClick={() => updateProgress('capituloActual', Math.max(1, seg.capituloActual - 1))}>-</button>
  <span>{seg.capituloActual}</span>
  <button onClick={() => updateProgress('capituloActual', seg.capituloActual + 1)}>+</button>
</div>

            <div className="tracker-item">
              <label>Estado</label>
              <select 
                value={seg.estado} 
                onChange={(e) => updateProgress('estado', e.target.value)}
                className="status-select"
              >
                <option value="VIENDO">Viendo</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>
          </div>

          <div className="tracker-footer">
            <button className="btn-save" onClick={handleSave}>Guardar cambios</button>
          </div>
        </section>
      </div>
    </div>
  </div>
);
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [series, setSeries] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const navigate = useNavigate();

const cargarDatos = () => {
  // 1. Cargar el catálogo general (para mostrar todas las series)
  fetch('http://localhost:8080/api/series', { credentials: 'include' })
    .then(res => res.json())
    .then(datos => setSeries(Array.isArray(datos) ? datos : []))
    .catch(err => console.error("Error catálogo:", err));

  // 2. Cargar tus seguimientos (para saber cuáles marcar con el check)
  fetch('http://localhost:8080/api/seguimientos/mis-seguimientos', { credentials: 'include' })
    .then(res => res.json())
    .then(datos => {
      setSeguimientos(Array.isArray(datos) ? datos : []);
    })
    .catch(err => {
      console.error("Error seguimientos:", err);
      setSeguimientos([]);
    });
};

  useEffect(() => {
    cargarDatos();
  }, []);

  const agregarAMiLista = (serieId) => {
    const nuevoSeguimiento = {
      serie: { id: serieId },
      estado: "VIENDO",
      temporadaActual: 1,
      capituloActual: 1
    };

    fetch('http://localhost:8080/api/seguimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoSeguimiento),
      credentials: 'include'
    })
    .then(res => {
      if(res.ok) cargarDatos(); // Recarga todo para actualizar el botón al instante
    });
  };

  const seriesFiltradas = series.filter(serie => {
    const coincideTexto = serie.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincidePlataforma = plataforma === '' || serie.plataforma.toLowerCase() === plataforma.toLowerCase();
    return coincideTexto && coincidePlataforma;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Catálogo de Series</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Buscar por título..." 
          onChange={(e) => setBusqueda(e.target.value)} 
          style={{ padding: '5px', flex: 1, maxWidth: '300px' }}
        />
        <select onChange={(e) => setPlataforma(e.target.value)} style={{ padding: '5px' }}>
          <option value="">Todas las plataformas</option>
          <option value="Netflix">Netflix</option>
          <option value="HBO">HBO</option>
          <option value="Amazon Prime">Amazon Prime</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {seriesFiltradas.map(serie => {
          // Comprobamos si el ID de esta serie ya existe en la lista de seguimientos del usuario
const laSigo = Array.isArray(seguimientos) && seguimientos.some(seg => seg.serie?.id === serie.id);
          return (
            <div key={serie.id} className="tarjeta-serie" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <strong>{serie.titulo}</strong> ({serie.anio})
                <p>📺 {serie.plataforma}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
                {/* Este botón lo conectaremos en el siguiente paso */}
                <button 
  onClick={() => navigate(`/serie/${serie.id}`)} 
  style={{ flex: 1, padding: '5px', cursor: 'pointer', border: 'none', borderRadius: '4px', background: '#343a40', color: 'white', fontWeight: 'bold' }}
>
  Ver Ficha
</button>
                
                {laSigo ? (
                  <button disabled style={{ flex: 1, padding: '5px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'not-allowed' }}>
                    ✅ Siguiendo
                  </button>
                ) : (
                  <button onClick={() => agregarAMiLista(serie.id)} style={{ flex: 1, padding: '5px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Añadir
                  </button>
                )}
              </div>
            </div>
          );
         
          
        })}
      </div>
    </div>
  );
}
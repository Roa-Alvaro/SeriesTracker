import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exito = await login(username, password);
    if (exito) {
      navigate('/mis-series');
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px',
        padding: '2rem', border: '1px solid #ccc', borderRadius: '8px'
      }}>
        <h2>Iniciar Sesión</h2>
        <input 
          name="username" 
          placeholder="Usuario" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: '0.5rem' }}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" style={{ 
          padding: '0.7rem', backgroundColor: '#2563eb', color: 'white', 
          border: 'none', borderRadius: '4px', cursor: 'pointer' 
        }}>
          Entrar
        </button>
        <Link to ='/register'>
                <p>¿Eres nuevo aqui? Registrate</p>
        </Link>
      </form>
    </div>
  );
};
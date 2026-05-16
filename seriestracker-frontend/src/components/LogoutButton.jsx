import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LogoutButton() {
  const { logout } = useContext(AuthContext); // Función que pone el user a null
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Backend: Invalida la sesión en Spring Boot
      const res = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        // 2. Contexto: Limpia el estado global (esto dispara el cambio en el Navbar)
        logout(); 
        
        // 3. Redirección
        navigate('/login');
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button className="btn-logout" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
}
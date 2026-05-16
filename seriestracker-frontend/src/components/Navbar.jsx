import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import LogoutButton  from './LogoutButton';
import { AuthContext } from '../context/AuthContext'; 
import { useContext } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/mis-series">🎬 SeriesTracker</Link>
      </div>
      <div className="navbar-links">
        <Link to="/buscar">Buscar</Link>
{user ? (
          <>
            <Link to="/mis-series">Mi Lista</Link>
            <LogoutButton />
          </>
        ) : (
          <Link to="/login" className="btn-login">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
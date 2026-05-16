import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registro.css';

export const Registro = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '', // Nuevo campo
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email, // Enviamos el mail
                    password: formData.password
                })
            });

            if (response.ok) {
                alert("¡Cuenta creada con éxito!");
                navigate('/login');
            } else {
                const msg = await response.text();
                setError(msg || 'Error al registrar el usuario');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Crear Cuenta</h2>
                
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Usuario</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            placeholder="ejemplo@correo.com"
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirmar Contraseña</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-auth">Registrarse</button>
                </form>

                <p className="auth-footer">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
};
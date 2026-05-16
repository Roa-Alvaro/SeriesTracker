import { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comprobar si hay sesión al abrir la web
  useEffect(() => {
   fetch('http://localhost:8080/api/auth/me', { credentials: 'include' })
    .then(res => {
      if (res.status === 401) return null; // Es normal si no ha iniciado sesión
      return res.ok ? res.json() : null;
    })
    .then(data => {
      setUser(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);

  const login = async (username, password) => {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    if (res.ok) {
      // Si el login es correcto, pedimos los datos del usuario
      const userData = await fetch('http://localhost:8080/api/auth/me', { credentials: 'include' }).then(r => r.json());
      setUser(userData);
      return true;
    }
    return false;
  };

 const logout = async () => {
  try {
    // 1. Avisamos al servidor para que invalide la sesión
    await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include' // Imprescindible para que el server sepa qué sesión cerrar
    });
  } catch (error) {
    console.error("Error al contactar con el servidor para logout:", error);
  } finally {
    // 2. Limpiamos React pase lo que pase
    setUser(null);
    window.location.href = '/login';
  }
};
  

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook para usarlo fácilmente
export const useAuth = () => useContext(AuthContext);
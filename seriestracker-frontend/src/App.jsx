import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import  Navbar  from './components/Navbar';
import {Login} from './pages/Login';
import Home from './pages/Home';
import MisSeries from './pages/MisSeries';
import DetalleSerie from './pages/DetalleSerie'; 
import { Buscador } from './components/Buscador';
import { Registro } from './pages/Registro';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    
    <AuthProvider>
    <BrowserRouter>
    <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Buscador/>}/>
        <Route path="/mis-series" element={<MisSeries />} />
        <Route path="/serie/:id" element={<DetalleSerie />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/serie/:id" element={<DetalleSerie />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
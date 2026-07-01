import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import HomeMap from './pages/HomeMap';
import Register from './components/Register'; // <-- Añadimos el import real de tu componente
import 'leaflet/dist/leaflet.css'; // ¡Obligatorio para que el mapa cargue bien!

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'system-ui', maxWidth: '900px', margin: '0 auto' }}>
        <Routes>
          {/* Si está logueado y va al login, lo mandamos al mapa */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          
          {/* Aquí ya estamos usando el componente real de Registro */}
          <Route path="/register" element={<Register />} />
          
          {/* Si NO está logueado y va al mapa, lo mandamos al login */}
          <Route path="/" element={isAuthenticated ? <HomeMap /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
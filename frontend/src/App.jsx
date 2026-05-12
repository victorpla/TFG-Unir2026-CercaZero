import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes "Mock" temporales (los sustituiremos por archivos reales en la carpeta pages)
const Login = () => <h2>Pantalla de Login</h2>;
const Register = () => <h2>Pantalla de Registro</h2>;
const HomeMap = () => <h2>🌍 Mapa Principal de CercaZero</h2>;

function App() {
  // Lógica simple para saber si el usuario está logueado
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1>CercaZero MVP</h1>
        
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta Privada (El Mapa) */}
          <Route 
            path="/" 
            element={isAuthenticated ? <HomeMap /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
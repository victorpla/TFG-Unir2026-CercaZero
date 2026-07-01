import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- 1. Importamos el hook de navegación

const Register = () => {
  const navigate = useNavigate(); // <-- 2. Inicializamos el hook

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      setMessage('✅ Usuario registrado con éxito. Redirigiendo...');
      
      // 3. Guardamos el token en el navegador (Local Storage)
      localStorage.setItem('token', response.data.token);
      
      // 4. Redirigimos al mapa principal después de un pequeño retraso
      // Usamos window.location.href para forzar la recarga y que App.jsx lea el nuevo token
      setTimeout(() => {
        window.location.href = '/';
      }, 1500); // Espera 1.5 segundos para que el usuario pueda leer el mensaje de éxito
      
    } catch (error) {
      setMessage('❌ Error al registrar: ' + (error.response?.data?.message || 'Error de conexión'));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Unirse a CercaZero 🌱</h2>
      <p>Crea tu cuenta para empezar a donar y recibir.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input
          type="text"
          name="name"
          placeholder="Tu Nombre"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <input
          type="email"
          name="email"
          placeholder="Tu Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <input
          type="password"
          name="password"
          placeholder="Tu Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Registrarse
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes('❌') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default Register;
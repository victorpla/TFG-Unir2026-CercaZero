import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../services/api';

export default function HomeMap() {
  const [items, setItems] = useState([]);
  // Centramos el mapa en unas coordenadas por defecto (ej. Madrid Centro)
  const [position, setPosition] = useState([40.416775, -3.703790]); 

  useEffect(() => {
    // Al cargar la pantalla, pedimos los ítems en un radio de 5km
    const fetchItems = async () => {
      try {
        const res = await api.get('/items/nearby?lng=-3.703790&lat=40.416775&radius=5000');
        setItems(res.data.data);
      } catch (error) {
        console.error("Error cargando los ítems", error);
      }
    };
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2>🌍 Mapa de Proximidad</h2>
        <button onClick={handleLogout} style={{ padding: '8px', cursor: 'pointer' }}>Cerrar Sesión</button>
      </div>
      
      {/* Contenedor del Mapa */}
      <MapContainer center={position} zoom={13} style={{ height: '70vh', width: '100%', borderRadius: '10px', border: '2px solid #ccc' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Renderizamos los marcadores basados en los datos de MongoDB */}
        {items.map(item => (
          <Marker key={item._id} position={[item.exactLocation.coordinates[1], item.exactLocation.coordinates[0]]}>
            <Popup>
              <strong>{item.title}</strong><br/>
              {item.description} <br/>
              <em>Categoría: {item.category}</em>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
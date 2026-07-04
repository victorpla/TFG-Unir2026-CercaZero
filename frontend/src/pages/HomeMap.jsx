import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🔧 FIX: Solución al problema de los iconos por defecto de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 📦 DATOS DE PRUEBA (Mock Data - Valencia)
const mockItems = [
  { id: 1, title: 'Silla de oficina', description: 'Silla ergonómica en buen estado. Tiene una rueda atascada.', category: 'Muebles', lat: 39.4699, lng: -0.3763 },
  { id: 2, title: 'Libros de texto', description: 'Matemáticas y Física de 2º de Bachillerato.', category: 'Educación', lat: 39.4750, lng: -0.3800 },
  { id: 3, title: 'Ropa de invierno', description: 'Abrigos y bufandas que ya no uso.', category: 'Ropa', lat: 39.4620, lng: -0.3650 },
  { id: 4, title: 'Monitor de PC 24"', description: 'Funciona perfecto, incluye cable HDMI.', category: 'Tecnología', lat: 39.4810, lng: -0.3550 },
];

const HomeMap = () => {
  // Centro del mapa inicial (Valencia)
  const mapCenter = [39.4699, -0.3763]; 

  return (
    <div>
      <h2>Explora donaciones cercanas 📍</h2>
      <p>Haz clic en los marcadores para ver los detalles del producto.</p>
      
      <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          
          {/* Capa de los mapas (Usamos OpenStreetMap, que es gratis) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Pintamos nuestros datos de prueba en el mapa */}
          {mockItems.map((item) => (
            <Marker key={item.id} position={[item.lat, item.lng]}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{item.title}</h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>{item.description}</p>
                  <span style={{ 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {item.category}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default HomeMap;
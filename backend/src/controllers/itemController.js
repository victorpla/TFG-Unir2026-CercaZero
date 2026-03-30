const Item = require('../models/Item');

// Endpoint: GET /api/items/nearby?lng=-3.703&lat=40.416&radius=5000
exports.getNearbyItems = async (req, res) => {
  try {
    const { lng, lat, radius } = req.query;

    if (!lng || !lat || !radius) {
      return res.status(400).json({ error: 'Faltan parámetros de localización' });
    }

    const radiusInMeters = parseInt(radius);

    // Consulta nativa GeoJSON de MongoDB
    const items = await Item.find({
      exactLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      },
      status: 'AVAILABLE'
    })
    .lean(); // .lean() mejora el rendimiento porque devuelve JS objects puros

    // PRIVACY BY DESIGN: Ofuscación de datos antes de enviar al cliente
    const safeItems = items.map(item => {
      // 1. Eliminamos la ubicación exacta para que nadie sepa dónde vive el donante
      delete item.exactLocation; 
      
      // 2. (Opcional) Aquí podríamos añadir un cálculo matemático para devolver 
      // una coordenada falsa desplazada +/- 200 metros para pintar en el mapa. En caso de ser necesario se implementará en fases posteriores.
      
      return item;
    });

    res.status(200).json({
      count: safeItems.length,
      data: safeItems
    });

  } catch (error) {
    console.error('Error en búsqueda espacial:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
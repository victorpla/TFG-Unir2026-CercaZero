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
    }).lean(); // .lean() devuelve JS objects puros

    // Procesamiento de los ítems antes de enviarlos
    const safeItems = items.map(item => {
      // 1. Extraemos las coordenadas (MongoDB usa [longitud, latitud])
      const itemLng = item.exactLocation.coordinates[0];
      const itemLat = item.exactLocation.coordinates[1];

      // 2. Creamos los campos que tu frontend (normalizeItem) espera leer
      item.lat = itemLat;
      item.lng = itemLng;

      // 3. PRIVACY BY DESIGN: Eliminamos el objeto exactLocation original 
      delete item.exactLocation;
      
      // Nota para tu TFG: Si en el futuro quieres ofuscar la ubicación 
      // para que no sea exacta, este es el punto exacto donde deberías 
      // sumarle o restarle unos decimales aleatorios a item.lat e item.lng.

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


exports.createItem = async (req, res) => {
  try {
    const { title, description, category, lng, lat, contactPhone } = req.body;

    const newItem = new Item({
      title,
      description,
      category,
      donorId: req.user.id, 
      contactPhone,
      exactLocation: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    await newItem.save();
    res.status(201).json({ message: 'Objeto publicado con éxito', item: newItem });
  } catch (error) {
    console.error("Fallo al crear el item:", error);
    res.status(500).json({ error: 'Error al publicar el objeto' });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'AVAILABLE', 'RESERVED' o 'DELIVERED'
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ error: 'Objeto no encontrado' });
    
    // Solo el dueño puede cambiar el estado
    if (item.donorId.toString() !== req.user.id) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    item.status = status;
    await item.save();
    res.json({ message: 'Estado actualizado', item });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};
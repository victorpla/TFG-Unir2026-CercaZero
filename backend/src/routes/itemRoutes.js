const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middleware/authMiddleware'); // ¡Aquí definimos auth!

// Ruta pública (cualquiera puede ver el mapa)
router.get('/nearby', itemController.getNearbyItems);

// Rutas privadas (solo usuarios con sesión iniciada)
router.post('/', auth, itemController.createItem);
router.put('/:id/status', auth, itemController.updateItemStatus);

module.exports = router;
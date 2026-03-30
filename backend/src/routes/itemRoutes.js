const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middleware/authMiddleware');

// Endpoint PÚBLICO: Buscar ítems cercanos
router.get('/nearby', itemController.getNearbyItems);

// Endpoint PRIVADO: Crear un ítem (requiere token JWT)
// router.post('/', auth, itemController.createItem); // Lo programarás en el controlador

module.exports = router;
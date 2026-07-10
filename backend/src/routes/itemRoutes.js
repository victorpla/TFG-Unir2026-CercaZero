const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware'); // Tu middleware de JWT

// 1. Rutas específicas primero
router.get('/nearby', itemController.getNearbyItems);
router.get('/me', authMiddleware, itemController.getMyItems);

// 2. Rutas raíz
router.post('/', authMiddleware, itemController.createItem);

// 3. Rutas con parámetros dinámicos (:id) al final
router.put('/:id/status', authMiddleware, itemController.updateItemStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
// Crear ítem (Protegido con token)
router.post('/', auth, itemController.createItem);
// Actualizar estado (Protegido con token)
router.put('/:id/status', auth, itemController.updateItemStatus);

module.exports = router;
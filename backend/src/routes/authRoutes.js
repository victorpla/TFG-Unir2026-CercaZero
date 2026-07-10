const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas públicas (no necesitan token)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Leer el token del header
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'Acceso denegado. No hay token.' });

  const token = authHeader.split(' ')[1]; // Formato: "Bearer <token>"

  try {
    // Verificar token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user; // Añadimos el ID del usuario a la request
    next(); // Pasar al siguiente controlador
  } catch (error) {
    res.status(400).json({ error: 'Token no válido' });
  }
};
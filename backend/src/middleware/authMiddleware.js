const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Leer el token de la cabecera
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Si no hay token, rechazamos la petición
  if (!token) {
    return res.status(401).json({ error: 'No hay token, permiso denegado' });
  }

  try {
    // Verificamos que el token sea válido usando nuestra palabra secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next(); // Si todo va bien, dejamos pasar a la siguiente función
  } catch (error) {
    res.status(401).json({ error: 'Token no válido' });
  }
};
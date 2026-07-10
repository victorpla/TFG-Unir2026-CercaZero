const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar si existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'El usuario ya existe' });

    // Encriptar contraseña (Asignatura: Seguridad)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Crear y devolver JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    // 2. Comparar contraseña con la encriptada en BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    // 3. Generar y devolver el Token JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
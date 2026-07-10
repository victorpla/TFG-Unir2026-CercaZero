const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a Base de Datos
connectDB();

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Definición de Rutas 
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/items', require('./src/routes/itemRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de CercaZero corriendo en puerto ${PORT}`);
});
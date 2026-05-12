import axios from 'axios';

// Creamos una instancia configurada para apuntar a tu Backend local
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// "Interceptor": Antes de que salga cualquier petición, le pegamos el Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
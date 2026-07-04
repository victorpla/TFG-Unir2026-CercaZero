import axios from "axios";

export const TOKEN_KEY = "cercazero_token";

/**
 * Instancia central de Axios. TODOS los servicios (auth, items…) deben
 * importar y usar esta instancia en lugar de axios directamente, para que
 * los interceptores de abajo se apliquen siempre.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
});

/**
 * Interceptor de PETICIÓN
 * Adjunta el JWT guardado en localStorage a cada llamada saliente.
 * Así, los componentes/servicios nunca necesitan pensar en el token:
 * simplemente llaman a `api.get(...)`, `api.post(...)`, etc.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de RESPUESTA
 * Si el backend responde 401 (token inválido/expirado), limpiamos la sesión
 * local y emitimos un evento global. AuthContext escucha ese evento y hace
 * el logout de la UI. Se usa un CustomEvent (en vez de importar AuthContext
 * aquí) para evitar una dependencia circular entre la capa de red y el
 * estado de React.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("cercazero_user");
      window.dispatchEvent(new CustomEvent("cercazero:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;

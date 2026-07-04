import { createContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../services/authService";
import { TOKEN_KEY } from "../services/api";

const USER_KEY = "cercazero_user";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const data = await loginUser(credentials);
      persistSession(data.token, data.user);
      toast.success(`¡Bienvenido/a, ${data.user?.name ?? ""}!`);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "No se pudo iniciar sesión");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setIsLoading(true);
    try {
      const data = await registerUser(payload);
      // Si el backend devuelve token+user al registrar, dejamos al usuario
      // logueado de inmediato. Si no, la pantalla de registro puede
      // redirigir a /login en su lugar.
      if (data.token) {
        persistSession(data.token, data.user);
      }
      toast.success("Cuenta creada correctamente");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "No se pudo completar el registro");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // El interceptor de respuesta de Axios (services/api.js) dispara este
  // evento global cuando el backend responde 401. Aquí reaccionamos
  // cerrando sesión en toda la app, venga la petición de donde venga.
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      toast.error("Tu sesión expiró. Inicia sesión de nuevo.");
    };
    window.addEventListener("cercazero:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("cercazero:unauthorized", handleUnauthorized);
  }, [logout]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

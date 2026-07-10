import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Envuelve rutas que requieren JWT válido (equivalente frontend a los
 * endpoints marcados "Requiere Auth: Sí" en el backend).
 * Si no hay sesión, redirige a /login conservando la ruta de origen.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

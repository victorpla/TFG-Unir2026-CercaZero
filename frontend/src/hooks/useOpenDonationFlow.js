import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import { useDonationModal } from "./useDonationModal";

/**
 * Punto único de entrada para "quiero publicar una donación".
 * Lo usan tanto el FAB de BottomNavbar (móvil) como el botón "Donar" de
 * TopNavbar (desktop), para no duplicar la regla de negocio en dos sitios:
 * si no hay sesión, redirige a /login en vez de abrir el modal.
 */
export function useOpenDonationFlow() {
  const { isAuthenticated } = useAuth();
  const { open } = useDonationModal();
  const navigate = useNavigate();

  return () => {
    if (!isAuthenticated) {
      toast("Inicia sesión para publicar una donación", { icon: "🔒" });
      navigate("/login");
      return;
    }
    open();
  };
}

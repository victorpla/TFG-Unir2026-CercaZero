import { NavLink, useNavigate } from "react-router-dom";
import { Map, ListChecks, Plus, UserRound, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useOpenDonationFlow } from "../../hooks/useOpenDonationFlow";

const linkClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors ${
    isActive ? "text-primary-700" : "text-primary-900/40"
  }`;

/**
 * Barra inferior: solo en móvil (`md:hidden`). Es la navegación principal
 * mobile-first, con un botón flotante central elevado para publicar una
 * donación desde cualquier pantalla.
 *
 * IMPORTANTE: vive en el flujo normal del layout (ver MainLayout.jsx), NO
 * usa `position: fixed`. Así reserva su propio espacio de forma nativa y
 * nada puede quedar oculto detrás de ella (p. ej. el mapa a pantalla
 * completa de HomeMapPage).
 */
export default function BottomNavbar() {
  const { isAuthenticated, logout } = useAuth();
  const openDonationFlow = useOpenDonationFlow();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (isAuthenticated) {
      logout();
      toast.success("Sesión cerrada");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="pb-safe border-t border-primary-100 bg-white md:hidden">
      <div className="mx-auto flex max-w-md items-center px-2 pt-2">
        <NavLink to="/" end className={linkClass}>
          <Map size={22} />
          Mapa
        </NavLink>

        <NavLink to="/mis-donaciones" className={linkClass}>
          <ListChecks size={22} />
          Mis donaciones
        </NavLink>

        <div className="flex flex-1 justify-center">
          <button
            onClick={openDonationFlow}
            className="-mt-8 grid h-16 w-16 place-items-center rounded-full bg-primary-600 text-white shadow-floating transition-transform active:scale-95"
            aria-label="Publicar nueva donación"
          >
            <Plus size={28} />
          </button>
        </div>

        <button onClick={handleAccountClick} className={linkClass({ isActive: false })}>
          {isAuthenticated ? <LogOut size={22} /> : <UserRound size={22} />}
          {isAuthenticated ? "Salir" : "Acceder"}
        </button>
      </div>
    </nav>
  );
}


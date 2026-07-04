import { Link, NavLink } from "react-router-dom";
import { Leaf, LogOut, User, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useOpenDonationFlow } from "../../hooks/useOpenDonationFlow";

const LINKS = [
  { to: "/", label: "Mapa" },
  { to: "/mis-donaciones", label: "Mis donaciones" },
];

/**
 * Barra superior: siempre visible. En móvil se reduce a marca + acceso
 * (el FAB de BottomNavbar es el punto de entrada para donar); en
 * escritorio (md+) despliega la navegación horizontal completa Y el botón
 * "Donar", ya que en desktop BottomNavbar no se renderiza (md:hidden) y
 * por tanto su FAB tampoco. Sin este botón, en desktop no habría ninguna
 * forma de abrir el modal de publicar donación.
 */
export default function TopNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const openDonationFlow = useOpenDonationFlow();

  return (
    <header className="sticky top-0 z-10 border-b border-primary-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-600 text-white">
            <Leaf size={18} />
          </span>
          <span className="font-display text-lg font-bold text-primary-900">CercaZero</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-primary-900/70 hover:bg-primary-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={openDonationFlow}
            className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <Plus size={16} />
            Donar
          </button>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary-900/70 hover:bg-primary-50"
            >
              <User size={16} />
              {user?.name?.split(" ")[0]}
              <LogOut size={16} className="text-primary-400" />
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


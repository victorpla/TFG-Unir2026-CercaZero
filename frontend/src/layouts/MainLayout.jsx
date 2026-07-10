import { Outlet } from "react-router-dom";
import TopNavbar from "../components/layout/TopNavbar";
import BottomNavbar from "../components/layout/BottomNavbar";
import DonationFormModal from "../components/donations/DonationFormModal";
import { DonationModalProvider } from "../context/DonationModalContext";

/**
 * Layout raíz de la aplicación. Se monta una única vez alrededor de todas
 * las rutas (ver router/AppRouter.jsx) y resuelve:
 *
 *  - Navegación responsive: TopNavbar (siempre) + BottomNavbar (solo móvil)
 *  - El modal de "Publicar donación", disponible desde cualquier pantalla
 *    a través del FAB de BottomNavbar en móvil o el botón "Donar" de
 *    TopNavbar en desktop (por eso vive aquí y no en una página concreta).
 *
 * Patrón "app shell": el contenedor raíz ocupa exactamente `h-screen` y
 * BottomNavbar es un hermano en el flujo normal (NO `position: fixed`).
 * Así reserva su propio espacio de forma nativa — nada puede superponerse
 * a ella porque, en el modelo de caja, su altura ya está "restada" del
 * espacio disponible para <main>. <main> es el único que hace scroll
 * (overflow-y-auto), TopNavbar y BottomNavbar quedan siempre fijos arriba
 * y abajo sin necesidad de calcular alturas en vh ni pelear con z-index.
 */
export default function MainLayout() {
  return (
    <DonationModalProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <BottomNavbar />
        <DonationFormModal />
      </div>
    </DonationModalProvider>
  );
}

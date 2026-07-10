import { createContext, useState, useCallback } from "react";

/**
 * Controla la visibilidad del modal de "Publicar donación" desde cualquier
 * punto de la app (el FAB vive en BottomNavbar, pero el modal se monta en
 * MainLayout). Evita pasar props manualmente entre componentes hermanos.
 */
export const DonationModalContext = createContext(null);

export function DonationModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <DonationModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DonationModalContext.Provider>
  );
}

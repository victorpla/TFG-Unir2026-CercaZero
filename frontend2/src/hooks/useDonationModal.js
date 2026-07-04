import { useContext } from "react";
import { DonationModalContext } from "../context/DonationModalContext";

export function useDonationModal() {
  const context = useContext(DonationModalContext);
  if (!context) {
    throw new Error("useDonationModal debe usarse dentro de <DonationModalProvider>");
  }
  return context;
}

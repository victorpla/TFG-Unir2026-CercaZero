import { useState, useEffect } from "react";

// Centro de Madrid como fallback si el usuario deniega la geolocalización.
const FALLBACK_POSITION = { lat: 40.4168, lng: -3.7038 };

/**
 * Obtiene la posición actual del navegador. Si el usuario deniega el
 * permiso o el navegador no soporta geolocalización, se usa un fallback
 * para que el mapa siempre tenga un centro válido.
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | denied

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setPosition(FALLBACK_POSITION);
      setStatus("error");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("success");
      },
      (error) => {
        setPosition(FALLBACK_POSITION);
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return { position, status };
}

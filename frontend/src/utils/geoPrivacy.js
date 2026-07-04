/**
 * Ofuscación de ubicación — capa de refuerzo en el CLIENTE.
 *
 * La ofuscación real y vinculante debe ocurrir en el backend: mientras un
 * ítem esté "disponible", la API nunca debería devolver la coordenada
 * exacta del domicilio del donante (solo un punto dentro de un radio de
 * unos ~80-150m). La dirección exacta solo se revela al receptor tras
 * confirmarse la reserva.
 *
 * Esta utilidad es una defensa adicional en el frontend: si por error la
 * API devolviera una coordenada exacta, este jitter determinista evita
 * pintar el marcador exactamente sobre el domicilio real.
 */
export function jitterCoordinate({ lat, lng }, meters = 80) {
  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453) % 1;
  const angle = seed * 2 * Math.PI;
  const metersToDegLat = meters / 111_320;
  const metersToDegLng = meters / (111_320 * Math.cos((lat * Math.PI) / 180));

  return {
    lat: lat + Math.sin(angle) * metersToDegLat,
    lng: lng + Math.cos(angle) * metersToDegLng,
  };
}

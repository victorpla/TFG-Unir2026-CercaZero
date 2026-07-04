import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Link } from "react-router-dom";
import L from "leaflet";
import { Apple, Shirt, Sofa, Boxes, Phone, MapPinOff, Lock } from "lucide-react";
import Spinner from "../ui/Spinner";
import StatusBadge from "../donations/StatusBadge";
import { useAuth } from "../../hooks/useAuth";

const CATEGORY_STYLES = {
  alimentos: { color: "#38875C", Icon: Apple, label: "Alimentos" },
  ropa: { color: "#A8703C", Icon: Shirt, label: "Ropa" },
  mobiliario: { color: "#8B5A2E", Icon: Sofa, label: "Mobiliario" },
  otros: { color: "#5BA97C", Icon: Boxes, label: "Otros" },
};

/**
 * Genera un icono de marcador "pin" personalizado (forma de gota) usando
 * los iconos de lucide-react, en vez del icono azul por defecto de Leaflet
 * (que además da problemas de rutas de assets con Vite). Se construye con
 * L.divIcon + HTML/SVG en lugar de una imagen estática.
 */
function buildDivIcon(category) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.otros;
  const html = renderToStaticMarkup(
    <span
      style={{
        background: style.color,
        width: 34,
        height: 34,
        borderRadius: "50% 50% 50% 0",
        transform: "rotate(-45deg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 3px 8px rgba(22,58,39,0.35)",
        border: "2px solid white",
      }}
    >
      <span style={{ transform: "rotate(45deg)", display: "flex" }}>
        <style.Icon color="white" size={16} strokeWidth={2.5} />
      </span>
    </span>
  );

  return L.divIcon({
    html,
    className: "donation-marker",
    iconSize: [34, 34],
    iconAnchor: [17, 32],
    popupAnchor: [0, -30],
  });
}

// Recentra el mapa cuando cambia el centro "base" (p.ej. al llegar la
// geolocalización inicial del usuario).
function RecenterOnChange({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng], map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.lat, center?.lng]);
  return null;
}

// Avisa al componente padre cuando el usuario mueve/hace zoom en el mapa,
// para volver a pedir GET /api/items/nearby con el nuevo centro.
function MapMoveWatcher({ onBoundsChange }) {
  useMapEvents({
    moveend: (event) => {
      const center = event.target.getCenter();
      onBoundsChange?.({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
}

/**
 * Mapa interactivo de donaciones cercanas.
 *
 * Props:
 *  - center: { lat, lng } — centro inicial/actual del mapa
 *  - items: array de donaciones, cada una con { id, title, description,
 *           category, location: { lat, lng } }
 *  - isLoading: boolean — muestra un indicador flotante mientras se
 *           consulta /items/nearby
 *  - onBoundsChange({ lat, lng }): se dispara al terminar de mover el mapa
 *  - onSelectItem(item): se dispara al pulsar un marcador
 */
export default function DonationMap({ center, items = [], isLoading = false, onBoundsChange, onSelectItem }) {
  const { isAuthenticated } = useAuth();
  const mappableItems = items.filter(
    (item) => item.location?.lat != null && item.location?.lng != null
  );
  // Ítems recibidos pero sin coordenadas — el backend no las está devolviendo.
  const unmappableCount = items.length - mappableItems.length;
  const getIcon = useMemo(() => {
    const cache = new Map();
    return (category) => {
      if (!cache.has(category)) cache.set(category, buildDivIcon(category));
      return cache.get(category);
    };
  }, []);

  if (!center) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <Spinner label="Obteniendo tu ubicación…" />
      </div>
    );
  }

  return (
    <div className="relative isolate h-full min-h-[60vh] w-full overflow-hidden md:rounded-3xl md:shadow-card">
      <MapContainer center={[center.lat, center.lng]} zoom={15} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterOnChange center={center} />
        <MapMoveWatcher onBoundsChange={onBoundsChange} />

        {mappableItems.map((item) => (
          <Marker
            key={item.id}
            position={[item.location.lat, item.location.lng]}
            icon={getIcon(item.category)}
            eventHandlers={{ click: () => onSelectItem?.(item) }}
          >
            <Popup>
              <div className="p-3">
                <p className="font-display text-sm font-bold text-primary-900">{item.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-primary-900/60">{item.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">
                    {CATEGORY_STYLES[item.category]?.label ?? "Otros"}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                {item.contactPhone && (
                  isAuthenticated ? (
                    <a
                      href={`tel:${item.contactPhone}`}
                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline"
                    >
                      <Phone size={12} />
                      {item.contactPhone}
                    </a>
                  ) : (
                    <Link
                      to="/login"
                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary-900/40 hover:text-primary-600"
                    >
                      <Lock size={12} />
                      Inicia sesión para ver el contacto
                    </Link>
                  )
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Spinner mientras carga */}
      {isLoading && (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-white px-4 py-2 shadow-floating">
          <Spinner label="Buscando donaciones…" size={16} />
        </div>
      )}

      {/* Badge cuando el backend devuelve ítems pero sin coordenadas */}
      {!isLoading && unmappableCount > 0 && mappableItems.length === 0 && (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 shadow-floating">
          <MapPinOff size={14} className="shrink-0 text-amber-600" />
          <span className="whitespace-nowrap text-xs font-semibold text-amber-800">
            {unmappableCount} ítem{unmappableCount !== 1 ? "s" : ""} encontrado{unmappableCount !== 1 ? "s" : ""} — consulta el panel inferior
          </span>
        </div>
      )}
    </div>
  );
}

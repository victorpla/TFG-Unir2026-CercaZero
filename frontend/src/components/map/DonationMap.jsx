import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Link } from "react-router-dom";
import L from "leaflet";
import { Apple, Shirt, Sofa, Boxes, Phone, MapPinOff, Lock, Layers } from "lucide-react";
import Spinner from "../ui/Spinner";
import StatusBadge from "../donations/StatusBadge";
import { useAuth } from "../../hooks/useAuth";

const CATEGORY_STYLES = {
  alimentos: { color: "#38875C", Icon: Apple, label: "Alimentos" },
  ropa:      { color: "#A8703C", Icon: Shirt, label: "Ropa" },
  mobiliario:{ color: "#8B5A2E", Icon: Sofa,  label: "Mobiliario" },
  otros:     { color: "#5BA97C", Icon: Boxes, label: "Otros" },
};

/** Pin de categoría: forma de gota con icono lucide. */
function buildDivIcon(category) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.otros;
  const html = renderToStaticMarkup(
    <span style={{
      background: style.color, width: 34, height: 34,
      borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 3px 8px rgba(22,58,39,0.35)", border: "2px solid white",
    }}>
      <span style={{ transform: "rotate(45deg)", display: "flex" }}>
        <style.Icon color="white" size={16} strokeWidth={2.5} />
      </span>
    </span>
  );
  return L.divIcon({
    html, className: "donation-marker",
    iconSize: [34, 34], iconAnchor: [17, 32], popupAnchor: [0, -30],
  });
}

/** Círculo verde con contador para posiciones con varios ítems. */
function buildGroupIcon(count) {
  const html = renderToStaticMarkup(
    <span style={{
      background: "#2A6C48", width: 40, height: 40, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "3px",
      border: "2.5px solid white", boxShadow: "0 3px 8px rgba(22,58,39,0.4)",
      color: "white", fontWeight: "700", fontSize: "13px", fontFamily: "system-ui",
    }}>
      <Layers size={12} color="white" strokeWidth={2.5} />
      {count}
    </span>
  );
  return L.divIcon({
    html, className: "donation-marker",
    iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -22],
  });
}

function RecenterOnChange({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng], map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.lat, center?.lng]);
  return null;
}

function MapMoveWatcher({ onBoundsChange }) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onBoundsChange?.({ lat: c.lat, lng: c.lng });
    },
  });
  return null;
}

/** Contenido reutilizable para un único ítem dentro de un Popup. */
function ItemPopupContent({ item, isAuthenticated }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-sm font-bold leading-tight text-primary-900">{item.title}</p>
        <StatusBadge status={item.status} />
      </div>
      {item.description && (
        <p className="mt-1 line-clamp-2 text-xs text-primary-900/60">{item.description}</p>
      )}
      <span className="mt-1.5 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">
        {CATEGORY_STYLES[item.category]?.label ?? "Otros"}
      </span>
      {item.contactPhone && (
        isAuthenticated ? (
          <a href={`tel:${item.contactPhone}`}
            className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline">
            <Phone size={12} />{item.contactPhone}
          </a>
        ) : (
          <Link to="/login"
            className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-primary-900/40 hover:text-primary-600">
            <Lock size={12} />Inicia sesión para ver el contacto
          </Link>
        )
      )}
    </>
  );
}

export default function DonationMap({ center, items = [], isLoading = false, onBoundsChange, onSelectItem }) {
  const { isAuthenticated } = useAuth();

  const mappableItems = items.filter(
    (item) => item.location?.lat != null && item.location?.lng != null
  );
  const unmappableCount = items.length - mappableItems.length;

  /**
   * Agrupa los ítems por posición exacta (6 decimales ≈ 10 cm de precisión).
   * Resultado: array de { lat, lng, items[] }.
   * - 1 ítem  → pin de categoría + popup individual.
   * - N ítems → círculo con contador + popup con lista desplazable.
   */
  const positionGroups = useMemo(() => {
    const groups = new Map();
    mappableItems.forEach((item) => {
      const key = `${item.location.lat.toFixed(6)},${item.location.lng.toFixed(6)}`;
      if (!groups.has(key)) {
        groups.set(key, { lat: item.location.lat, lng: item.location.lng, items: [] });
      }
      groups.get(key).items.push(item);
    });
    return Array.from(groups.values());
  }, [mappableItems]);

  const getSingleIcon = useMemo(() => {
    const cache = new Map();
    return (category) => {
      if (!cache.has(category)) cache.set(category, buildDivIcon(category));
      return cache.get(category);
    };
  }, []);

  const getGroupIcon = useMemo(() => {
    const cache = new Map();
    return (count) => {
      if (!cache.has(count)) cache.set(count, buildGroupIcon(count));
      return cache.get(count);
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

        {positionGroups.map((group) => {
          const single = group.items.length === 1;
          return (
            <Marker
              key={`${group.lat}-${group.lng}`}
              position={[group.lat, group.lng]}
              icon={single ? getSingleIcon(group.items[0].category) : getGroupIcon(group.items.length)}
              eventHandlers={{ click: () => single && onSelectItem?.(group.items[0]) }}
            >
              {single ? (
                <Popup>
                  <div className="p-3">
                    <ItemPopupContent item={group.items[0]} isAuthenticated={isAuthenticated} />
                  </div>
                </Popup>
              ) : (
                <Popup maxWidth={260}>
                  <div>
                    <p className="border-b border-primary-100 px-3 py-2 font-display text-xs font-bold text-primary-900">
                      {group.items.length} donaciones en este punto
                    </p>
                    {/* overflow inline: Tailwind no controla el scroll dentro
                        del contenedor gestionado por Leaflet, se fuerza con style */}
                    <div style={{ maxHeight: 280, overflowY: "auto" }}>
                      {group.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`p-3 ${idx > 0 ? "border-t border-primary-50" : ""}`}
                        >
                          <ItemPopupContent item={item} isAuthenticated={isAuthenticated} />
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      {isLoading && (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-white px-4 py-2 shadow-floating">
          <Spinner label="Buscando donaciones…" size={16} />
        </div>
      )}

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

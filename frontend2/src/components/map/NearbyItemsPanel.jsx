import { useState } from "react";
import { ChevronDown, ChevronUp, MapPinOff } from "lucide-react";
import NearbyItemCard from "./NearbyItemCard";
import Spinner from "../ui/Spinner";

/**
 * Panel de lista que aparece debajo del mapa cuando hay ítems cercanos.
 * Funciona como fuente de verdad independiente de si los ítems tienen
 * coordenadas o no: la lista SIEMPRE muestra lo que devuelve el backend;
 * los marcadores del mapa aparecerán automáticamente en cuanto el backend
 * incluya lat/lng en la respuesta de /items/nearby.
 *
 * En móvil: panel colapsable anclado en la parte inferior del viewport
 * del mapa, con scroll horizontal de tarjetas.
 * En desktop (md+): columna lateral derecha con scroll vertical.
 */
export default function NearbyItemsPanel({ items, isLoading, onItemClick }) {
  const [collapsed, setCollapsed] = useState(false);

  const hasItems = items.length > 0;
  const mappableCount = items.filter(
    (i) => i.location?.lat != null && i.location?.lng != null
  ).length;
  const missingCoords = hasItems && mappableCount === 0;

  if (!isLoading && !hasItems) return null;

  return (
    <div className="flex shrink-0 flex-col border-t border-primary-100 bg-background md:border-t-0">
      {/* Cabecera del panel */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between px-4 py-3 md:cursor-default md:pointer-events-none"
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Spinner label="Buscando…" size={14} />
          ) : (
            <>
              <span className="font-display text-sm font-bold text-primary-900">
                {items.length} donación{items.length !== 1 ? "es" : ""} encontrada{items.length !== 1 ? "s" : ""}
              </span>
              {missingCoords && (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <MapPinOff size={11} />
                  Sin ubicación en mapa
                </span>
              )}
            </>
          )}
        </div>
        <span className="text-primary-400 md:hidden">
          {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Aviso de coordenadas faltantes (solo para el desarrollador) */}
      {missingCoords && !collapsed && (
        <div className="mx-4 mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <strong>Backend pendiente:</strong> el endpoint{" "}
          <code className="rounded bg-amber-100 px-1">/api/items/nearby</code> devuelve ítems
          pero no incluye coordenadas (<code>lat</code>/<code>lng</code>) en la respuesta. Los
          marcadores en el mapa aparecerán automáticamente cuando el backend las incluya.
        </div>
      )}

      {/* Lista de tarjetas */}
      {!collapsed && !isLoading && (
        <>
          {/* Scroll horizontal en móvil */}
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-4 md:hidden">
            {items.map((item) => (
              <div key={item.id} className="w-64 shrink-0">
                <NearbyItemCard item={item} onClick={onItemClick} />
              </div>
            ))}
          </div>

          {/* Grid en desktop */}
          <div className="hidden gap-3 overflow-y-auto px-4 pb-4 md:grid md:max-h-64 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <NearbyItemCard key={item.id} item={item} onClick={onItemClick} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useCallback } from "react";
import DonationMap from "../components/map/DonationMap";
import NearbyItemsPanel from "../components/map/NearbyItemsPanel";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNearbyItems } from "../hooks/useNearbyItems";

const DEFAULT_RADIUS = Number(import.meta.env.VITE_DEFAULT_SEARCH_RADIUS) || 1500;

export default function HomeMapPage() {
  const { position } = useGeolocation();
  const [center, setCenter] = useState(null);
  const radius = DEFAULT_RADIUS;

  const effectiveCenter = center ?? position;

  const { items, isLoading } = useNearbyItems({
    lat: effectiveCenter?.lat,
    lng: effectiveCenter?.lng,
    radius,
  });

  const handleBoundsChange = useCallback((newCenter) => setCenter(newCenter), []);

  return (
    <section className="mx-auto flex h-full max-w-5xl flex-col md:px-6 md:py-4">
      <div className="mb-3 hidden shrink-0 px-4 md:block">
        <h1 className="font-display text-2xl font-bold text-primary-900">
          Donaciones cerca de ti
        </h1>
        <p className="text-sm text-primary-900/60">
          Radio de búsqueda: {(radius / 1000).toFixed(1)} km
        </p>
      </div>

      {/* El mapa ocupa todo el espacio disponible en flex. min-h-0 es
          obligatorio para que el flex child pueda encogerse correctamente
          cuando NearbyItemsPanel también necesita espacio. */}
      <div className="min-h-0 flex-1">
        <DonationMap
          center={effectiveCenter}
          items={items}
          isLoading={isLoading}
          onBoundsChange={handleBoundsChange}
        />
      </div>

      {/* Panel de lista: siempre muestra los ítems aunque falten coords.
          Desaparece solo si no hay resultados y no está cargando. */}
      <NearbyItemsPanel
        items={items}
        isLoading={isLoading}
      />
    </section>
  );
}


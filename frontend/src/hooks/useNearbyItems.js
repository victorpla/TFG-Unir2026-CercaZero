import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getNearbyItems } from "../services/itemsService";

/**
 * Envuelve GET /api/items/nearby con estado de carga/error y un `refetch`
 * manual, para poder volver a pedir datos cuando cambia el centro del mapa.
 */
export function useNearbyItems({ lat, lng, radius }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    if (lat == null || lng == null) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNearbyItems({ lat, lng, radius });
      setItems(data.items ?? data);
    } catch (err) {
      setError(err);
      toast.error("No se pudieron cargar las donaciones cercanas");
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, radius]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, isLoading, error, refetch: fetchItems };
}

import { useEffect, useState } from "react";
import { PackageOpen } from "lucide-react";
import DonationCard from "../components/donations/DonationCard";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { normalizeItemsResponse } from "../services/itemsService";

/**
 * Endpoint confirmado por Victor: GET /api/items/me (protegido).
 * Devuelve los ítems publicados por el usuario autenticado.
 */
export default function MyDonationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const { data } = await api.get("/items/me");
        setItems(normalizeItemsResponse(data));
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMine();
  }, []);

  const handleStatusChange = (updated) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner label="Cargando tus donaciones…" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6 md:py-8">
      <h1 className="font-display text-2xl font-bold text-primary-900">
        Hola, {user?.name?.split(" ")[0] ?? "vecino/a"} 👋
      </h1>
      <p className="mb-6 mt-1 text-sm text-primary-900/60">Gestiona el estado de tus donaciones publicadas.</p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white py-16 text-center shadow-card">
          <PackageOpen className="text-primary-300" size={32} />
          <p className="text-sm font-medium text-primary-900/60">Aún no has publicado ninguna donación.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <DonationCard key={item.id} item={item} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </section>
  );
}

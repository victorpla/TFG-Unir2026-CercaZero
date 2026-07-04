import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateItemStatus } from "../../services/itemsService";
import StatusBadge, { STATUS_CONFIG } from "./StatusBadge";

// Ciclo de vida de una donación — confirmado con Postman que el backend
// usa códigos en mayúsculas/inglés (p.ej. { status: "RESERVED" }).
const FLOW = ["AVAILABLE", "RESERVED", "DELIVERED"];
const NEXT_ACTION_LABEL = {
  AVAILABLE: "Marcar como reservado",
  RESERVED: "Marcar como entregado",
};

/**
 * Botón de avance de estado para el propietario de una donación.
 * Llama a PUT /api/items/:id/status con el siguiente estado del ciclo.
 */
export default function StatusManager({ item, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const currentStatus = item.status?.toUpperCase();
  const currentIndex = FLOW.indexOf(currentStatus);
  const nextStatus = FLOW[currentIndex + 1];

  const handleAdvance = async () => {
    if (!nextStatus) return;
    setIsUpdating(true);
    try {
      const updated = await updateItemStatus(item.id, nextStatus);
      toast.success(`Actualizado a "${STATUS_CONFIG[nextStatus].label}"`);
      onStatusChange?.(updated);
    } catch (error) {
      toast.error(error.response?.data?.message || "No se pudo actualizar el estado");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <StatusBadge status={item.status} />

      {nextStatus ? (
        <button
          onClick={handleAdvance}
          disabled={isUpdating}
          className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          {NEXT_ACTION_LABEL[currentStatus]}
        </button>
      ) : (
        <span className="text-xs font-medium text-primary-900/40">Ciclo completado</span>
      )}
    </div>
  );
}

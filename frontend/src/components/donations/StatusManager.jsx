import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2, Undo2 } from "lucide-react";
import { updateItemStatus } from "../../services/itemsService";
import StatusBadge, { STATUS_CONFIG } from "./StatusBadge";

const NEXT_STATUS = {
  AVAILABLE: "RESERVED",
  RESERVED: "DELIVERED",
};

const NEXT_LABEL = {
  AVAILABLE: "Reservar",
  RESERVED: "Marcar entregado",
};

/**
 * Controles de estado para el propietario de una donación.
 * - Avance: AVAILABLE → RESERVED → DELIVERED
 * - Retroceso: solo RESERVED → AVAILABLE (cancelar reserva)
 *   DELIVERED es irreversible por diseño (el ciclo ya se completó).
 */
export default function StatusManager({ item, onStatusChange }) {
  const [loadingAction, setLoadingAction] = useState(null); // "advance" | "undo" | null

  const currentStatus = item.status?.toUpperCase();
  const nextStatus = NEXT_STATUS[currentStatus];
  const canUndo = currentStatus === "RESERVED";

  const handleTransition = async (targetStatus, actionKey) => {
    setLoadingAction(actionKey);
    try {
      const updated = await updateItemStatus(item.id, targetStatus);
      toast.success(`Estado actualizado a "${STATUS_CONFIG[targetStatus].label}"`);
      onStatusChange?.(updated);
    } catch (error) {
      toast.error(error.response?.data?.message || "No se pudo actualizar el estado");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <StatusBadge status={item.status} />

      <div className="flex items-center gap-2">
        {/* Botón de retroceso: solo visible en RESERVED */}
        {canUndo && (
          <button
            onClick={() => handleTransition("AVAILABLE", "undo")}
            disabled={loadingAction !== null}
            title="Volver a disponible"
            className="flex items-center gap-1 rounded-xl border border-primary-200 bg-white px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-50 disabled:opacity-50"
          >
            {loadingAction === "undo" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Undo2 size={13} />
            )}
            Disponible
          </button>
        )}

        {/* Botón de avance */}
        {nextStatus ? (
          <button
            onClick={() => handleTransition(nextStatus, "advance")}
            disabled={loadingAction !== null}
            className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {loadingAction === "advance" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <CheckCircle2 size={13} />
            )}
            {NEXT_LABEL[currentStatus]}
          </button>
        ) : (
          <span className="text-xs font-medium text-primary-900/40">Completado</span>
        )}
      </div>
    </div>
  );
}


import { Phone, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../donations/StatusBadge";
import { useAuth } from "../../hooks/useAuth";

const CATEGORY_EMOJI = {
  alimentos: "🍎",
  ropa: "👕",
  mobiliario: "🛋️",
  otros: "📦",
};

export default function NearbyItemCard({ item, onClick }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-4 shadow-card">
      <button
        onClick={() => onClick?.(item)}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">
            {CATEGORY_EMOJI[item.category] ?? CATEGORY_EMOJI.otros}
          </span>
          <p className="font-display text-sm font-bold leading-tight text-primary-900">
            {item.title}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </button>

      {item.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-primary-900/60">
          {item.description}
        </p>
      )}

      {item.contactPhone && (
        isAuthenticated ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
            <Phone size={11} />
            {item.contactPhone}
          </span>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-900/40 hover:text-primary-600"
          >
            <Lock size={11} />
            Inicia sesión para ver el contacto
          </Link>
        )
      )}
    </div>
  );
}

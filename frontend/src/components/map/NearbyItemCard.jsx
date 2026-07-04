import { Phone } from "lucide-react";
import StatusBadge from "../donations/StatusBadge";

const CATEGORY_EMOJI = {
  alimentos: "🍎",
  ropa: "👕",
  mobiliario: "🛋️",
  otros: "📦",
};

export default function NearbyItemCard({ item, onClick }) {
  return (
    <button
      onClick={() => onClick?.(item)}
      className="flex w-full flex-col gap-2 rounded-2xl bg-white p-4 text-left shadow-card transition-shadow hover:shadow-floating active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">
            {CATEGORY_EMOJI[item.category] ?? CATEGORY_EMOJI.otros}
          </span>
          <p className="font-display text-sm font-bold text-primary-900 leading-tight">
            {item.title}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {item.description && (
        <p className="line-clamp-2 text-xs text-primary-900/60 leading-relaxed">
          {item.description}
        </p>
      )}

      {item.contactPhone && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
          <Phone size={11} />
          {item.contactPhone}
        </span>
      )}
    </button>
  );
}

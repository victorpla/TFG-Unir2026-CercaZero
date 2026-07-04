import { PackageSearch, Phone } from "lucide-react";
import StatusManager from "./StatusManager";

export default function DonationCard({ item, onStatusChange }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-card">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-primary-50">
        {/* El backend actual no devuelve foto — placeholder listo para
            cuando se añada soporte de imagen. */}
        {item.photoUrl ? (
          <img src={item.photoUrl} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-primary-300">
            <PackageSearch size={24} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-display text-sm font-bold text-primary-900">{item.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-primary-900/60">{item.description}</p>
          {item.contactPhone && (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary-900/50">
              <Phone size={12} />
              {item.contactPhone}
            </p>
          )}
        </div>
        <StatusManager item={item} onStatusChange={onStatusChange} />
      </div>
    </div>
  );
}

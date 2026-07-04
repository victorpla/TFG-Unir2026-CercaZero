import { Loader2 } from "lucide-react";

export default function Spinner({ label = "Cargando…", size = 20, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-primary-700 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="animate-spin" size={size} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

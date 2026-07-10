// Códigos confirmados por Postman (PUT /items/:id/status usa "RESERVED").
// Se asume el resto del ciclo en el mismo estilo: AVAILABLE / DELIVERED.
// Si tu backend usa otros nombres, este es el único sitio que hay que tocar.
export const STATUS_CONFIG = {
  AVAILABLE: { label: "Disponible", className: "bg-primary-50 text-primary-700" },
  RESERVED: { label: "Reservado", className: "bg-amber-50 text-amber-700" },
  DELIVERED: { label: "Entregado", className: "bg-gray-100 text-gray-600" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status?.toUpperCase()] ?? STATUS_CONFIG.AVAILABLE;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${config.className}`}>
      {config.label}
    </span>
  );
}

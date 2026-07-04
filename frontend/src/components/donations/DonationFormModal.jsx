import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import { useDonationModal } from "../../hooks/useDonationModal";
import { useGeolocation } from "../../hooks/useGeolocation";
import { createItem } from "../../services/itemsService";

const CATEGORIES = [
  { value: "alimentos", label: "Alimentos" },
  { value: "ropa", label: "Ropa" },
  { value: "mobiliario", label: "Mobiliario" },
  { value: "otros", label: "Otros" },
];

export default function DonationFormModal({ onCreated }) {
  const { isOpen, close } = useDonationModal();
  const { position, status: geoStatus } = useGeolocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { title: "", description: "", category: "alimentos", contactPhone: "" },
  });

  // Al cerrar el modal, reseteamos el formulario para que la próxima
  // apertura empiece limpia.
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values) => {
    if (!position) {
      toast.error("Necesitamos tu ubicación para publicar la donación");
      return;
    }

    setIsSubmitting(true);
    try {
      // POST /items espera JSON plano: { title, description, category,
      // contactPhone, lng, lat }. El backend actual no soporta foto.
      const created = await createItem({
        title: values.title,
        description: values.description,
        category: values.category,
        contactPhone: values.contactPhone,
        lat: position.lat,
        lng: position.lng,
      });
      toast.success("¡Donación publicada!");
      onCreated?.(created);
      close();
    } catch (error) {
      toast.error(error.response?.data?.message || "No se pudo publicar la donación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary-900/40 md:items-center md:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-4xl bg-white p-6 shadow-floating md:rounded-4xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-primary-900">Publicar donación</h2>
          <button
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-full text-primary-900/50 hover:bg-primary-50"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField
            label="Título"
            placeholder="Ej. Bolsa de naranjas ecológicas"
            error={errors.title}
            registration={register("title", {
              required: "El título es obligatorio",
              maxLength: { value: 60, message: "Máximo 60 caracteres" },
            })}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-semibold text-primary-900">
              Descripción
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Estado del producto, cantidad, horario de recogida…"
              className={`w-full rounded-xl border bg-white px-4 py-3.5 text-base text-primary-900 placeholder:text-primary-900/40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.description ? "border-red-400 focus:ring-red-400" : "border-primary-100"
              }`}
              {...register("description", { required: "Añade una breve descripción" })}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-semibold text-primary-900">
              Categoría
            </label>
            <select
              id="category"
              className="w-full rounded-xl border border-primary-100 bg-white px-4 py-3.5 text-base text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register("category")}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <TextField
            label="Teléfono de contacto"
            type="tel"
            placeholder="+34 611 22 33 44"
            error={errors.contactPhone}
            registration={register("contactPhone", {
              required: "Indica un teléfono para que puedan contactarte",
              minLength: { value: 9, message: "Introduce un teléfono válido" },
            })}
          />

          <div className="flex items-center gap-2 rounded-xl bg-earth-50 px-4 py-3 text-sm text-earth-700">
            <MapPin size={18} className="shrink-0" />
            {geoStatus === "loading" && "Detectando tu ubicación…"}
            {geoStatus === "success" &&
              "Ubicación detectada. Se ofuscará antes de publicarse para proteger tu privacidad."}
            {(geoStatus === "denied" || geoStatus === "error") &&
              "No pudimos obtener tu ubicación exacta; se usará una zona aproximada."}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Publicar donación
          </Button>
        </form>
      </div>
    </div>
  );
}

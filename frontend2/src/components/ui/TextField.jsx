/**
 * Campo de texto controlado por React Hook Form.
 * Uso: <TextField label="Correo" registration={register("email", { required: true })} error={errors.email} />
 * `registration` es el objeto { name, onChange, onBlur, ref } que devuelve register().
 */
export default function TextField({ label, error, registration, type = "text", placeholder, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={registration.name} className="text-sm font-semibold text-primary-900">
        {label}
      </label>
      <input
        id={registration.name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-base text-primary-900
          placeholder:text-primary-900/40 focus:outline-none focus:ring-2 focus:ring-primary-500
          ${error ? "border-red-400 focus:ring-red-400" : "border-primary-100"}`}
        {...registration}
        {...rest}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}

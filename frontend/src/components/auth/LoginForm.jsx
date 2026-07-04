import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await login(values);
      navigate("/");
    } catch {
      // El error ya se notifica vía toast dentro de AuthContext.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        error={errors.email}
        registration={register("email", {
          required: "El correo es obligatorio",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Introduce un correo válido" },
        })}
      />

      <TextField
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.password}
        registration={register("password", {
          required: "La contraseña es obligatoria",
          minLength: { value: 6, message: "Mínimo 6 caracteres" },
        })}
      />

      <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-primary-900/60">
        ¿Aún no tienes cuenta?{" "}
        <Link to="/register" className="font-semibold text-primary-700 hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}

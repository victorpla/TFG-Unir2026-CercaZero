import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      navigate("/");
    } catch {
      // El error ya se notifica vía toast dentro de AuthContext.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField
        label="Nombre"
        placeholder="Cómo quieres que te vean tus vecinos"
        error={errors.name}
        registration={register("name", { required: "El nombre es obligatorio" })}
      />

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

      <TextField
        label="Confirmar contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword}
        registration={register("confirmPassword", {
          required: "Confirma tu contraseña",
          validate: (value) => value === watch("password") || "Las contraseñas no coinciden",
        })}
      />

      <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-primary-900/60">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-semibold text-primary-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}

import { Leaf } from "lucide-react";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-600 text-white">
          <Leaf size={26} />
        </span>
        <h1 className="font-display text-2xl font-bold text-primary-900">Únete a CercaZero</h1>
        <p className="mt-1 text-sm text-primary-900/60">Empieza a donar y reducir el desperdicio en tu barrio</p>
      </div>

      <RegisterForm />
    </section>
  );
}

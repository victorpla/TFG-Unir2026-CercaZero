import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
  secondary: "bg-earth-100 text-earth-800 hover:bg-earth-200 active:bg-earth-300",
  ghost: "bg-transparent text-primary-700 hover:bg-primary-50",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5
        font-display text-base font-semibold transition-colors duration-150
        disabled:cursor-not-allowed disabled:opacity-50
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
}

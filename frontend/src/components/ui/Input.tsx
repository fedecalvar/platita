import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
}

// Input de formulario del sistema de diseño: 40px de alto, radio 8px, borde
// de 1px que pasa a ring de foco de 2px (ver design.md → Inputs & Form
// Fields). El ícono izquierdo y el elemento derecho (ej. toggle de
// contraseña) son opcionales para no forzar el mismo padding en todos lados.
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon, rightElement, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="font-sans text-label-md text-on-surface">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && <span className="pointer-events-none absolute left-3 text-outline">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 font-sans text-body-md text-on-surface placeholder:text-outline transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            icon && "pl-10",
            rightElement && "pr-10",
            error && "border-error focus:border-error focus:ring-error/20",
            className,
          )}
          {...props}
        />
        {rightElement && <span className="absolute right-3 flex items-center">{rightElement}</span>}
      </div>
      {error && <p className="font-sans text-body-sm text-error">{error}</p>}
    </div>
  );
});

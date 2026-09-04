import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

// Ver design.md → Components → Buttons. Nada de rounded-full acá: los
// controles interactivos usan 8px (rounded-lg), reservamos el radio
// completo para avatares e indicadores de estado.
const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-on-primary shadow-sm hover:bg-primary-container",
  secondary:
    "bg-surface-container-lowest text-on-surface shadow-[inset_0_0_0_1px_var(--color-outline-variant)] hover:bg-surface-container-low",
  ghost: "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
  destructive: "text-error hover:bg-error-container/60",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // active:scale-[0.98] es la "subtle scale compression" que pide el
        // spec de botones — alcanza y sobra, no hace falta motion acá.
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 font-sans text-button transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

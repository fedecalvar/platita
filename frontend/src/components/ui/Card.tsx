import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Card genérica: superficie más clara que el fondo, radio de 12px, sombra
// sutil (ver design.md → Cards & Modules / Elevation, nivel 1).
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl bg-surface-container-lowest p-6 shadow-sm", className)} {...props} />
  );
}

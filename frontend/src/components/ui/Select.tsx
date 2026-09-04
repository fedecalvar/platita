import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

// Select nativo estilizado (mismo alto/radio que Input) — no vale la pena
// un combobox custom para listas simples como cuenta/categoría/tipo.
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, className, children, id, ...props },
  ref,
) {
  const selectId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="font-sans text-label-md text-on-surface">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 pr-9 font-sans text-body-md text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-outline" />
      </div>
    </div>
  );
});

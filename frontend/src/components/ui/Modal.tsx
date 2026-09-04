import { type ReactNode, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Modal genérico (nivel 3 de elevación de design.md: radio 12px, sombra
// marcada). Cierra con Escape o clickeando el overlay, nunca clickeando
// adentro del panel (el stopPropagation de abajo evita ese cierre accidental).
export function Modal({ open, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Foco atrapado adentro del modal (Tab/Shift+Tab ciclan solo entre sus
  // elementos) y devuelto a quien lo abrió al cerrar — sin esto, Tab se
  // escapa hacia la página de atrás, que sigue "visible" bajo el overlay.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-md flex-col gap-5 rounded-xl bg-surface-container-lowest p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-headline-md text-on-surface">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                aria-label="Cerrar"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Wallet } from "lucide-react";

// Layout compartido por Login y Registro: header con el wordmark + card
// centrada con una entrada sutil (fade + leve desplazamiento). No hotlinkeamos
// el logo de los mockups (una imagen alojada en un CDN de Google ajeno al
// proyecto) — usamos un ícono de Lucide como marca provisoria.
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Wallet className="h-5 w-5" strokeWidth={2} />
          </div>
          <span className="font-heading text-headline-sm text-primary">Platita</span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

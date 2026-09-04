import type { ReactNode } from "react";
import { LayoutGrid, LogOut, Receipt, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/cuentas", label: "Cuentas", icon: Wallet, end: false },
  { to: "/transacciones", label: "Transacciones", icon: Receipt, end: false },
];

// Shell de las pantallas autenticadas: sidebar fija a la izquierda en
// desktop, tab bar fija abajo en mobile (más simple y más usable en pantalla
// chica que ocultar la nav atrás de un botón de hamburguesa).
export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col justify-between border-r border-surface-container-highest bg-surface-container-low p-4 md:flex">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-heading text-headline-sm text-primary">Platita</span>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-label-md transition-colors",
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-container p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
              <span className="font-sans text-label-md">{user?.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-sans text-label-md text-on-surface">{user?.name}</span>
              <span className="truncate font-sans text-label-sm text-on-surface-variant">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="flex-shrink-0 rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-surface-container-highest bg-surface-container-lowest md:hidden">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 font-sans text-label-sm transition-colors",
                isActive ? "text-primary" : "text-on-surface-variant",
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="px-4 pt-6 pb-20 md:ml-60 md:px-8 md:pt-8 md:pb-8">
        <div className="mx-auto flex w-full max-w-[72rem] flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}

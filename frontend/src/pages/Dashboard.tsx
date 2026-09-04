import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

// Placeholder para probar que el flujo de auth + ruta protegida funciona de
// punta a punta. El Dashboard real (balance, gráfico por categoría, últimas
// transacciones) es el próximo paso.
export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <p className="font-heading text-headline-md text-on-surface">¡Hola, {user?.name}! 👋</p>
      <p className="font-sans text-body-md text-on-surface-variant">
        Sesión iniciada correctamente. El Dashboard con tus cuentas y movimientos viene en el próximo paso.
      </p>
      <Button variant="secondary" onClick={logout}>
        Cerrar sesión
      </Button>
    </div>
  );
}

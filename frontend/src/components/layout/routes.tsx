import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Envuelve las rutas privadas (Dashboard, Cuentas, Transacciones). Mientras
// useAuth todavía está validando un token guardado contra /auth/me no
// renderiza nada de la app ni redirige — evita un flash a /login para un
// usuario que en realidad sí tiene sesión válida.
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-sans text-body-md text-on-surface-variant">Cargando…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

// Inverso: Login/Registro no tienen sentido con sesión activa, mandan al
// Dashboard directo.
export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}

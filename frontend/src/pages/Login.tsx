import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password, remember);
      navigate("/", { replace: true });
    } catch (err) {
      // INVALID_CREDENTIALS es el único código esperado acá (mismo mensaje
      // para email inexistente o password mal, ver auth.service.ts); un
      // error de red también cae bien con el mensaje del ApiError.
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-heading text-headline-md text-on-surface">Platita</h1>
          <p className="font-sans text-body-md text-on-surface-variant">
            Tus finanzas claras, sin vueltas ni tecnicismos bancarios.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            icon={<Mail className="h-[18px] w-[18px]" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            icon={<Lock className="h-[18px] w-[18px]" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-outline transition-colors hover:text-on-surface"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-[18px] w-[18px] cursor-pointer rounded accent-primary"
            />
            <span className="font-sans text-body-sm text-on-surface-variant">
              Recordarme en este equipo
            </span>
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-error-container px-3 py-2 font-sans text-body-sm text-on-error-container"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
          </Button>
        </form>

        <p className="text-center font-sans text-body-sm text-on-surface-variant">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-container">
            Registrate
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}

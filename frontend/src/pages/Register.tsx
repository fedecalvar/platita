import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

type Strength = "empty" | "weak" | "ok" | "strong";

// Mismo criterio de longitud que el mockup de Stitch (no viene del backend:
// auth.schema.ts solo exige mínimo 8 caracteres). Es una guía visual, no
// una validación — el submit no se bloquea por esto.
function getStrength(password: string): Strength {
  if (password.length === 0) return "empty";
  if (password.length < 8) return "weak";
  if (password.length < 12) return "ok";
  return "strong";
}

const STRENGTH_ORDER: Strength[] = ["weak", "ok", "strong"];

const strengthCopy: Record<Strength, { label: string; textClass: string; barClass: string }> = {
  empty: { label: "Mínimo 8 caracteres", textClass: "text-outline", barClass: "bg-outline-variant" },
  weak: { label: "Corta", textClass: "text-error", barClass: "bg-error" },
  ok: { label: "Aceptable", textClass: "text-secondary", barClass: "bg-secondary-container" },
  strong: { label: "Segura", textClass: "text-tertiary", barClass: "bg-tertiary" },
};

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);
  const filledBars = strength === "empty" ? 0 : STRENGTH_ORDER.indexOf(strength) + 1;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      // EMAIL_TAKEN es el caso esperado (ver auth.service.ts); errores de
      // validación de Zod (password corta, etc.) también llegan como
      // ApiError con su propio mensaje.
      setError(err instanceof ApiError ? err.message : "No se pudo crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-heading text-headline-md text-on-surface">Crear tu cuenta</h1>
          <p className="font-sans text-body-md text-on-surface-variant">
            Empezá a ordenar tu plata de forma simple y transparente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nombre completo"
            name="name"
            placeholder="Tu nombre o cómo te llamás"
            icon={<UserIcon className="h-[18px] w-[18px]" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
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
          <div className="flex flex-col gap-1.5">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mínimo 8 caracteres"
              icon={<Lock className="h-[18px] w-[18px]" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-outline transition-colors hover:text-on-surface"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <div className="flex items-center gap-2 px-0.5">
              <div className="flex h-1 flex-1 gap-1 overflow-hidden rounded-full bg-surface-container">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-full flex-1 transition-colors duration-200 ${
                      i < filledBars ? strengthCopy[strength].barClass : "bg-outline-variant"
                    }`}
                  />
                ))}
              </div>
              <span className={`font-sans text-label-sm ${strengthCopy[strength].textClass}`}>
                {strengthCopy[strength].label}
              </span>
            </div>
          </div>

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
            {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </form>

        <p className="text-center font-sans text-body-sm text-on-surface-variant">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-container">
            ¡Iniciá sesión!
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}

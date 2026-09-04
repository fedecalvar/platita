import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/token";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Arranca en true: hasta confirmar (o no) un token guardado contra
  // /auth/me no sabemos si hay sesión, y ProtectedRoute no puede decidir
  // todavía si redirige a /login o deja pasar.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then(setUser)
      .catch(() => {
        // Token vencido o de un usuario que ya no existe; apiFetch ya lo
        // borró de storage en el 401, acá solo falta reflejarlo en el estado.
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string, remember = true) {
    const result = await authApi.login({ email, password });
    setToken(result.token, remember);
    setUser(result.user);
  }

  async function register(name: string, email: string, password: string) {
    const result = await authApi.register({ name, email, password });
    setToken(result.token);
    setUser(result.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return ctx;
}

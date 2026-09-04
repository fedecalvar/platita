// Cliente de API: un único punto de contacto con el backend. Cada función
// de acá abajo (authApi, accountsApi, ...) devuelve directamente el `data`
// de la respuesta ya tipado, o tira ApiError — así los componentes hacen
// `try { await accountsApi.create(...) } catch (err) { ... }` normal, sin
// tener que chequear `.success` en cada llamada.
import { clearToken, getToken } from "./token";
import type {
  Account,
  Category,
  DashboardByCategory,
  DashboardSummary,
  Transaction,
  TransactionType,
  User,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL;

// Mismo shape que documenta CLAUDE.md para los errores del backend
// ({ success:false, error:{ message, code } }), normalizado acá para que el
// resto de la app nunca tenga que mirar el body crudo del fetch.
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code: string } };

// object (no un Record tipado) a propósito: así interfaces "de forma"
// como TransactionFilters —sin index signature— se pueden pasar directo sin
// pelearse con la estructural typing de TS por cada filtro opcional nuevo.
type RequestParams = object;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: RequestParams;
}

function buildUrl(path: string, params?: RequestParams) {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    // undefined se omite (no "undefined" literal en la query string) para
    // que filtros opcionales como accountId/from/to no viajen si no se usaron.
    for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, params } = options;
  const token = getToken();

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch solo rechaza acá por fallas de red/CORS (backend caído, sin
    // conexión) — nunca por un 4xx/5xx, esos sí resuelven con response.ok=false.
    throw new ApiError("No se pudo conectar con el servidor", "NETWORK_ERROR", 0);
  }

  const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!json || !response.ok || !json.success) {
    // Un 401 acá siempre significa "token vencido o inválido" (ver
    // requireAuth en el backend, nunca devuelve 401 por otra razón). Limpiar
    // el token no alcanza solo: useAuth guarda el user en memoria, así que
    // sin este evento la sesión seguiría "activa" en pantalla hasta el
    // próximo reload — el evento le avisa a useAuth ahora mismo.
    if (response.status === 401) {
      clearToken();
      window.dispatchEvent(new Event("platita:unauthorized"));
    }

    const message = json && !json.success ? json.error.message : "Error inesperado del servidor";
    const code = json && !json.success ? json.error.code : "UNKNOWN_ERROR";
    throw new ApiError(message, code, response.status);
  }

  return json.data;
}

// ---- Auth ----

export const authApi = {
  register: (input: { email: string; password: string; name: string }) =>
    apiFetch<{ token: string; user: User }>("/auth/register", { method: "POST", body: input }),
  login: (input: { email: string; password: string }) =>
    apiFetch<{ token: string; user: User }>("/auth/login", { method: "POST", body: input }),
  me: () => apiFetch<User>("/auth/me"),
};

// ---- Accounts ----

export const accountsApi = {
  list: () => apiFetch<Account[]>("/accounts"),
  create: (input: { name: string }) => apiFetch<Account>("/accounts", { method: "POST", body: input }),
  update: (id: string, input: { name: string }) =>
    apiFetch<Account>(`/accounts/${id}`, { method: "PATCH", body: input }),
  remove: (id: string) => apiFetch<null>(`/accounts/${id}`, { method: "DELETE" }),
};

// ---- Categories ----

export const categoriesApi = {
  list: (type?: TransactionType) => apiFetch<Category[]>("/categories", { params: { type } }),
};

// ---- Transactions ----

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  from?: string;
  to?: string;
}

export interface TransactionInput {
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
}

// Prisma serializa `Decimal` como STRING en JSON (probado contra el backend
// real: `"amount":"12000"`, con comillas) — sin este normalizador, todo lo
// que toque tx.amount funciona hoy de pura casualidad (Math.abs, el menos
// unario y las comparaciones coaccionan strings a número solas), pero
// `total += tx.amount` en el futuro concatenaría strings en vez de sumar.
function normalizeTransaction(tx: Transaction): Transaction {
  return { ...tx, amount: Number(tx.amount) };
}

export const transactionsApi = {
  list: async (filters: TransactionFilters = {}) => {
    const data = await apiFetch<Transaction[]>("/transactions", { params: filters });
    return data.map(normalizeTransaction);
  },
  get: async (id: string) => normalizeTransaction(await apiFetch<Transaction>(`/transactions/${id}`)),
  create: async (input: TransactionInput) =>
    normalizeTransaction(await apiFetch<Transaction>("/transactions", { method: "POST", body: input })),
  update: async (id: string, input: Partial<TransactionInput>) =>
    normalizeTransaction(await apiFetch<Transaction>(`/transactions/${id}`, { method: "PATCH", body: input })),
  remove: (id: string) => apiFetch<null>(`/transactions/${id}`, { method: "DELETE" }),
};

// ---- Dashboard ----

export const dashboardApi = {
  summary: () => apiFetch<DashboardSummary>("/dashboard/summary"),
  byCategory: (params: { month?: number; year?: number } = {}) =>
    apiFetch<DashboardByCategory>("/dashboard/by-category", { params }),
};

// Tipos que espejan el modelo de datos del backend (ver
// backend/src/prisma/schema.prisma y CLAUDE.md). Viven separados de api.ts
// para que páginas/componentes los importen sin arrastrar el cliente HTTP.

export type TransactionType = "income" | "expense";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  // Lo calcula el backend al vuelo (suma de transacciones), nunca se persiste.
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  // Nombre de un ícono de Lucide (ver mapeo en CLAUDE.md), no un ícono en sí.
  icon: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  // Aunque el backend usa Decimal, JSON no tiene ese tipo — llega como number.
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  name: string;
  icon: string;
  type: TransactionType;
  total: number;
  percentage: number;
}

export interface DashboardByCategory {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  categories: CategoryBreakdownItem[];
}

import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { useAccounts } from "@/hooks/useAccounts";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useTransactions } from "@/hooks/useTransactions";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { getChartColor } from "@/lib/chartPalette";
import { formatCurrency, formatSignedCurrency, formatTransactionDate } from "@/lib/format";

// Cuántas transacciones mostrar en "Últimos movimientos". El backend no
// soporta `limit` en /transactions (ver transaction.schema.ts), así que
// traemos todas (ya vienen ordenadas por fecha desc) y cortamos acá — a la
// escala de un usuario personal no justifica pedir paginación al backend.
const RECENT_TRANSACTIONS_COUNT = 5;

export function Dashboard() {
  const { user } = useAuth();
  const { summary, byCategory, isLoading: isSummaryLoading, error: summaryError } = useDashboardSummary();
  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { categories } = useCategories();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const isLoading = isSummaryLoading || isAccountsLoading || isTransactionsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-sans text-body-md text-on-surface-variant">Cargando tu resumen…</p>
      </div>
    );
  }

  if (summaryError || !summary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-sans text-body-md text-error">{summaryError ?? "No se pudo cargar el resumen"}</p>
      </div>
    );
  }

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const accountById = new Map(accounts.map((a) => [a.id, a]));

  // El donut solo tiene sentido para gastos (ver mockup "Gastos por
  // Categoría"): mezclar ingresos y egresos en la misma torta no comunica
  // nada útil.
  const expenseCategories = (byCategory?.categories ?? []).filter((c) => c.type === "expense");
  const recentTransactions = transactions.slice(0, RECENT_TRANSACTIONS_COUNT);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col">
        <h1 className="font-heading text-headline-lg text-on-surface">¡Hola, {user?.name}! 👋</h1>
        <p className="font-sans text-body-md text-on-surface-variant">Acá está el resumen de tu plata al día de hoy.</p>
      </div>

      {/* Balance total + ingresos/gastos del mes */}
      <Card className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider">
            Balance total disponible
          </span>
          <span className="font-heading text-display-lg text-on-surface">
            <AnimatedNumber value={summary.totalBalance} />
          </span>
        </div>

        <div className="flex items-center gap-6 border-t border-surface-container pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-label-sm text-on-surface-variant">Ingresos del mes</span>
              <span className="font-sans text-numeric-md text-tertiary">
                {formatSignedCurrency(summary.monthlyIncome)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 text-error">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-label-sm text-on-surface-variant">Gastos del mes</span>
              <span className="font-sans text-numeric-md text-error">
                {formatSignedCurrency(-summary.monthlyExpense)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Balance por cuenta */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <h2 className="font-heading text-headline-sm text-on-surface">Tus cuentas</h2>
          <span className="font-sans text-label-sm text-on-surface-variant">({accounts.length})</span>
        </div>

        {accounts.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="font-sans text-body-md text-on-surface-variant">Todavía no cargaste ninguna cuenta.</p>
            <Link to="/cuentas" className="font-sans text-label-md font-semibold text-primary hover:text-primary-container">
              Crear tu primera cuenta →
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {accounts.map((account) => (
              <Card key={account.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <span className="font-sans text-label-md font-semibold text-on-surface">{account.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-label-sm text-on-surface-variant">Disponible</span>
                  <span className="font-sans text-headline-sm text-on-surface">{formatCurrency(account.balance)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Gastos por categoría */}
        <Card className="flex flex-col gap-4 lg:col-span-5">
          <h2 className="font-heading text-headline-sm text-on-surface">Gastos por categoría</h2>

          {expenseCategories.length === 0 ? (
            <p className="py-8 text-center font-sans text-body-md text-on-surface-variant">
              Todavía no registraste gastos este mes.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-center py-2">
                <DonutChart
                  segments={expenseCategories.map((c, i) => ({ value: c.total, color: getChartColor(i) }))}
                >
                  <span className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Total del mes
                  </span>
                  <span className="font-heading text-headline-md text-on-surface">
                    {formatCurrency(byCategory!.totalExpense)}
                  </span>
                </DonutChart>
              </div>

              <div className="flex flex-col gap-1">
                {expenseCategories.map((category, i) => (
                  <div key={category.categoryId} className="flex items-center justify-between rounded-lg p-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: getChartColor(i) }}
                      />
                      <span className="truncate font-sans text-body-md text-on-surface">{category.name}</span>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <span className="font-sans text-numeric-sm text-on-surface">{formatCurrency(category.total)}</span>
                      <span className="w-10 text-right font-sans text-label-sm text-on-surface-variant">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Últimos movimientos */}
        <Card className="flex flex-col gap-2 lg:col-span-7">
          <h2 className="font-heading text-headline-sm text-on-surface">Últimos movimientos</h2>

          {recentTransactions.length === 0 ? (
            <p className="py-8 text-center font-sans text-body-md text-on-surface-variant">
              Todavía no registraste ningún movimiento.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-surface-container">
              {recentTransactions.map((tx) => {
                const category = categoryById.get(tx.categoryId);
                const account = accountById.get(tx.accountId);
                const Icon = getCategoryIcon(category?.icon ?? "");
                const title = tx.description || category?.name || "Movimiento";

                return (
                  <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                          tx.type === "income" ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-sans text-label-md font-semibold text-on-surface">{title}</span>
                        <span className="truncate font-sans text-body-sm text-on-surface-variant">
                          {formatTransactionDate(tx.date)} • {account?.name ?? "Cuenta eliminada"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span
                        className={`block font-sans text-numeric-md ${
                          tx.type === "income" ? "text-tertiary" : "text-error"
                        }`}
                      >
                        {formatSignedCurrency(tx.type === "income" ? tx.amount : -tx.amount)}
                      </span>
                      <span className="font-sans text-label-sm text-on-surface-variant">{category?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}

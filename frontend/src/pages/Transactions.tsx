import { type FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { ApiError, transactionsApi, type TransactionInput } from "@/lib/api";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { formatSignedCurrency, formatTransactionDate, getTodayInputValue, isoToDateInputValue } from "@/lib/format";
import type { Transaction, TransactionType } from "@/lib/types";

interface FilterState {
  accountId: string;
  categoryId: string;
  type: TransactionType | "";
  from: string;
  to: string;
}

const EMPTY_FILTERS: FilterState = { accountId: "", categoryId: "", type: "", from: "", to: "" };

export function Transactions() {
  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  // useTransactions solo refetchea cuando cambia el JSON de los filtros, así
  // que no importa que este objeto sea nuevo en cada render.
  const apiFilters = {
    accountId: filters.accountId || undefined,
    categoryId: filters.categoryId || undefined,
    type: filters.type || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
  };
  const { transactions, isLoading, error, refetch } = useTransactions(apiFilters);

  const [modalTx, setModalTx] = useState<Transaction | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const accountById = new Map(accounts.map((a) => [a.id, a]));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  // El filtro de categoría respeta el de tipo: si ya elegiste "Gastos" no
  // tiene sentido ofrecer categorías de ingreso en el otro select.
  const filterableCategories = filters.type ? categories.filter((c) => c.type === filters.type) : categories;
  const hasActiveFilters = Object.values(filters).some(Boolean);

  async function handleDelete(tx: Transaction) {
    if (!window.confirm("¿Eliminar esta transacción?")) return;
    setDeletingId(tx.id);
    try {
      await transactionsApi.remove(tx.id);
      await refetch();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "No se pudo eliminar la transacción");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col">
          <h1 className="font-heading text-headline-lg text-on-surface">Transacciones</h1>
          <p className="font-sans text-body-md text-on-surface-variant">
            Historial de ingresos y gastos de todas tus cuentas.
          </p>
        </div>
        {isAccountsLoading ? null : accounts.length > 0 ? (
          <Button onClick={() => setModalTx("new")} className="self-start md:self-auto">
            <Plus className="h-[18px] w-[18px]" />
            Nueva transacción
          </Button>
        ) : (
          <p className="font-sans text-body-sm text-on-surface-variant">Creá una cuenta primero para poder cargar movimientos.</p>
        )}
      </div>

      {/* Filtros */}
      <Card className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select
            aria-label="Cuenta"
            value={filters.accountId}
            onChange={(e) => setFilters((f) => ({ ...f, accountId: e.target.value }))}
          >
            <option value="">Todas las cuentas</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Tipo"
            value={filters.type}
            onChange={(e) =>
              setFilters((f) => ({ ...f, type: e.target.value as TransactionType | "", categoryId: "" }))
            }
          >
            <option value="">Todos los tipos</option>
            <option value="expense">Gastos</option>
            <option value="income">Ingresos</option>
          </Select>

          <Select
            aria-label="Categoría"
            value={filters.categoryId}
            onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
          >
            <option value="">Todas las categorías</option>
            {filterableCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Input
            aria-label="Desde"
            type="date"
            value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
          />
          <Input
            aria-label="Hasta"
            type="date"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="flex items-center gap-1.5 self-start font-sans text-label-md text-on-surface-variant transition-colors hover:text-error"
            type="button"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar filtros
          </button>
        )}
      </Card>

      {/* Listado */}
      {isLoading ? (
        <p className="py-12 text-center font-sans text-body-md text-on-surface-variant">Cargando movimientos…</p>
      ) : error ? (
        <p className="py-12 text-center font-sans text-body-md text-error">{error}</p>
      ) : transactions.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="font-sans text-body-md text-on-surface-variant">
            {hasActiveFilters ? "No hay movimientos con estos filtros." : "Todavía no registraste ningún movimiento."}
          </p>
        </Card>
      ) : (
        <Card className="flex flex-col divide-y divide-surface-container p-0">
          {transactions.map((tx) => {
            const category = categoryById.get(tx.categoryId);
            const account = accountById.get(tx.accountId);
            const Icon = getCategoryIcon(category?.icon ?? "");
            const title = tx.description || category?.name || "Movimiento";

            return (
              <div key={tx.id} className="flex items-center justify-between gap-3 px-5 py-3">
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
                      {category?.name} • {account?.name ?? "Cuenta eliminada"} • {formatTransactionDate(tx.date)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <span
                    className={`font-sans text-numeric-md ${tx.type === "income" ? "text-tertiary" : "text-error"}`}
                  >
                    {formatSignedCurrency(tx.type === "income" ? tx.amount : -tx.amount)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setModalTx(tx)}
                      className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      title="Editar"
                      type="button"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tx)}
                      disabled={deletingId === tx.id}
                      className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container/60 hover:text-error disabled:opacity-50"
                      title="Eliminar"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <TransactionModal
        tx={modalTx}
        onClose={() => setModalTx(null)}
        onSaved={async () => {
          setModalTx(null);
          await refetch();
        }}
      />
    </motion.div>
  );
}

interface TransactionModalProps {
  tx: Transaction | "new" | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

function TransactionModal({ tx, onClose, onSaved }: TransactionModalProps) {
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const isEditing = tx !== null && tx !== "new";

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getTodayInputValue());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categoriesForType = useMemo(() => categories.filter((c) => c.type === type), [categories, type]);

  // Precarga el form al abrir el modal (nueva o edición) — se reinicia cada
  // vez que cambia `tx`, no solo la primera vez que se monta.
  useEffect(() => {
    if (isEditing) {
      setType(tx.type);
      setAmount(String(tx.amount));
      setAccountId(tx.accountId);
      setCategoryId(tx.categoryId);
      setDescription(tx.description ?? "");
      setDate(isoToDateInputValue(tx.date));
    } else {
      // Calculamos la categoría inicial acá mismo (no la dejamos en "" para
      // que la sincronice el efecto de abajo): ese efecto solo corre de
      // nuevo cuando cambia `type`, y al reabrir el modal en modo "nueva"
      // el tipo por default sigue siendo "expense" — no cambia, así que ese
      // efecto no se dispara y la categoría quedaba pisada en "".
      setType("expense");
      setAmount("");
      setAccountId(accounts[0]?.id ?? "");
      setCategoryId(categories.find((c) => c.type === "expense")?.id ?? "");
      setDescription("");
      setDate(getTodayInputValue());
    }
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

  // Si cambia el tipo y la categoría elegida ya no corresponde (el backend
  // rechaza esa combinación, ver assertCategoryMatchesType), reseteamos a la
  // primera categoría válida del tipo nuevo en vez de dejar guardar y fallar.
  useEffect(() => {
    if (!categoriesForType.some((c) => c.id === categoryId)) {
      setCategoryId(categoriesForType[0]?.id ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, categoriesForType]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!accountId || !categoryId || !parsedAmount || parsedAmount <= 0) {
      setError("Completá cuenta, categoría y un monto mayor a 0");
      return;
    }

    setIsSaving(true);
    try {
      const input: TransactionInput = {
        accountId,
        categoryId,
        amount: parsedAmount,
        type,
        description: description.trim() || undefined,
        date,
      };
      if (isEditing) {
        await transactionsApi.update(tx.id, input);
      } else {
        await transactionsApi.create(input);
      }
      await onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar la transacción");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal open={tx !== null} onClose={onClose} title={isEditing ? "Editar transacción" : "Nueva transacción"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-container-low p-1">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 font-sans text-label-md transition-all ${
              type === "expense"
                ? "bg-surface-container-lowest font-semibold text-error shadow-sm"
                : "text-on-surface-variant hover:text-error"
            }`}
          >
            <ArrowUpRight className="h-[18px] w-[18px]" />
            Gasto
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 font-sans text-label-md transition-all ${
              type === "income"
                ? "bg-surface-container-lowest font-semibold text-tertiary shadow-sm"
                : "text-on-surface-variant hover:text-tertiary"
            }`}
          >
            <ArrowDownLeft className="h-[18px] w-[18px]" />
            Ingreso
          </button>
        </div>

        <Input
          label="Monto"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Cuenta" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            <option value="" disabled>
              Elegir cuenta
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>

          <Select label="Categoría" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="" disabled>
              Elegir categoría
            </option>
            {categoriesForType.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Descripción (opcional)"
          placeholder="Ej: Supermercado, Alquiler, Sueldo…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={255}
        />

        <Input label="Fecha" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        {error && <p className="font-sans text-body-sm text-error">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear transacción"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

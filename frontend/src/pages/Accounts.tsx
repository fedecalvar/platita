import { type FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAccounts } from "@/hooks/useAccounts";
import { ApiError, accountsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@/lib/types";

export function Accounts() {
  const { accounts, isLoading, error, refetch } = useAccounts();
  const [modalAccount, setModalAccount] = useState<Account | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  async function handleDelete(account: Account) {
    // confirm() nativo: es la única confirmación destructiva de todo el MVP,
    // no justifica un modal aparte solo para esto.
    if (!window.confirm(`¿Eliminar "${account.name}"? Sus transacciones también se van a borrar.`)) return;

    setDeletingId(account.id);
    try {
      await accountsApi.remove(account.id);
      await refetch();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "No se pudo eliminar la cuenta");
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
          <h1 className="font-heading text-headline-lg text-on-surface">Tus cuentas</h1>
          <p className="font-sans text-body-md text-on-surface-variant">
            Administrá tus billeteras y cuentas bancarias en un solo lugar.
          </p>
        </div>
        <Button onClick={() => setModalAccount("new")} className="self-start md:self-auto">
          <Plus className="h-[18px] w-[18px]" />
          Nueva cuenta
        </Button>
      </div>

      {!isLoading && accounts.length > 0 && (
        <Card className="flex items-center justify-between">
          <span className="font-sans text-label-md text-on-surface-variant">Total en cuentas</span>
          <span className="font-heading text-headline-md text-on-surface">{formatCurrency(totalBalance)}</span>
        </Card>
      )}

      {isLoading ? (
        <p className="py-12 text-center font-sans text-body-md text-on-surface-variant">Cargando cuentas…</p>
      ) : error ? (
        <p className="py-12 text-center font-sans text-body-md text-error">{error}</p>
      ) : accounts.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="font-sans text-body-md text-on-surface-variant">Todavía no cargaste ninguna cuenta.</p>
          <Button onClick={() => setModalAccount("new")}>
            <Plus className="h-[18px] w-[18px]" />
            Crear tu primera cuenta
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wallet className="h-5 w-5" />
                </div>
                <span className="font-sans text-label-md font-semibold text-on-surface">{account.name}</span>
              </div>

              <div className="flex w-full items-center justify-between gap-4 border-t border-surface-container pt-3 md:w-auto md:border-t-0 md:pt-0">
                <div className="flex flex-col md:items-end">
                  <span className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wide">
                    Disponible
                  </span>
                  <span className="font-sans text-numeric-lg text-on-surface">{formatCurrency(account.balance)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setModalAccount(account)}
                    className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                    title="Editar cuenta"
                    type="button"
                  >
                    <Pencil className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    onClick={() => handleDelete(account)}
                    disabled={deletingId === account.id}
                    className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container/60 hover:text-error disabled:opacity-50"
                    title="Eliminar cuenta"
                    type="button"
                  >
                    <Trash2 className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AccountModal
        account={modalAccount}
        onClose={() => setModalAccount(null)}
        onSaved={async () => {
          setModalAccount(null);
          await refetch();
        }}
      />
    </motion.div>
  );
}

interface AccountModalProps {
  account: Account | "new" | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

function AccountModal({ account, onClose, onSaved }: AccountModalProps) {
  const isEditing = account !== null && account !== "new";
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Resetea el input cada vez que se abre el modal (o cambia a qué cuenta
  // apunta) — sin esto quedaría el nombre de la última cuenta editada.
  useEffect(() => {
    setName(isEditing ? account.name : "");
    setError(null);
  }, [account, isEditing]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      if (isEditing) {
        await accountsApi.update(account.id, { name });
      } else {
        await accountsApi.create({ name });
      }
      await onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar la cuenta");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal open={account !== null} onClose={onClose} title={isEditing ? "Editar cuenta" : "Nueva cuenta"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre de la cuenta"
          placeholder="Ej: Banco Galicia, Mercado Pago, Efectivo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="font-sans text-body-sm text-error">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear cuenta"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

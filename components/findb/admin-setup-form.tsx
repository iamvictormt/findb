"use client"

import { useActionState } from "react"
import { ShieldCheck } from "lucide-react"
import { createFirstAdmin, type AdminSetupState } from "@/app/admin/setup/actions"
import { Field, FormPanel, Input } from "@/components/ui/form-controls"
import { translateFeedback, useI18n } from "@/lib/i18n"

const initialState: AdminSetupState = {
  ok: false,
  message: "",
}

export function AdminSetupForm() {
  const [state, formAction, pending] = useActionState(createFirstAdmin, initialState)
  const { t } = useI18n()

  return (
    <form action={formAction}>
      <FormPanel className="grid gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold text-primary">Criar primeiro admin</h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
            Esta etapa fica disponível apenas enquanto não existir nenhum administrador no banco.
          </p>
        </div>

        <Field label="Nome">
          <Input name="name" required />
        </Field>

        <Field label="Email">
          <Input name="email" type="email" required />
        </Field>

        <Field label="Senha">
          <Input name="password" type="password" minLength={8} required />
        </Field>

        <Field label="Confirmar senha">
          <Input name="confirmPassword" type="password" minLength={8} required />
        </Field>

        {state.message && (
          <div className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold leading-relaxed text-accent" aria-live="polite">
            {translateFeedback(t, state.message)}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          {pending ? "Criando admin..." : "Criar admin"}
        </button>
      </FormPanel>
    </form>
  )
}

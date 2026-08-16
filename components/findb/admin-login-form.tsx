"use client"

import { useActionState } from "react"
import { LockKeyhole } from "lucide-react"
import { loginAdmin, type AdminLoginState } from "@/app/admin/login/actions"
import { Field, FormPanel, Input } from "@/components/ui/form-controls"
import { type Lang, translateFeedback, useI18n } from "@/lib/i18n"

const initialState: AdminLoginState = {
  ok: false,
  message: "",
}

const adminLoginFormCopy: Record<
  Lang,
  {
    title: string
    description: string
    email: string
    password: string
    entering: string
    submit: string
  }
> = {
  ptBr: {
    title: "Admin FindB",
    description: "Acesso restrito para aprovar influenciadores e acompanhar campanhas.",
    email: "Email",
    password: "Senha",
    entering: "Entrando...",
    submit: "Entrar como admin",
  },
  ptPt: {
    title: "Admin FindB",
    description: "Acesso restrito para aprovar influenciadores e acompanhar campanhas.",
    email: "Email",
    password: "Palavra-passe",
    entering: "A entrar...",
    submit: "Entrar como admin",
  },
  en: {
    title: "FindB Admin",
    description: "Restricted access to approve influencers and track campaigns.",
    email: "Email",
    password: "Password",
    entering: "Signing in...",
    submit: "Sign in as admin",
  },
  es: {
    title: "Admin FindB",
    description: "Acceso restringido para aprobar influencers y acompañar campañas.",
    email: "Email",
    password: "Contraseña",
    entering: "Entrando...",
    submit: "Entrar como admin",
  },
  fr: {
    title: "Admin FindB",
    description: "Accès restreint pour approuver les influenceurs et suivre les campagnes.",
    email: "Email",
    password: "Mot de passe",
    entering: "Connexion...",
    submit: "Se connecter comme admin",
  },
}

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState)
  const { lang, t } = useI18n()
  const labels = adminLoginFormCopy[lang]

  return (
    <form action={formAction}>
      <FormPanel className="grid gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold text-primary">{labels.title}</h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
            {labels.description}
          </p>
        </div>

        <Field label={labels.email}>
          <Input name="email" type="email" required />
        </Field>

        <Field label={labels.password}>
          <Input name="password" type="password" required />
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
          <LockKeyhole className="size-4" aria-hidden="true" />
          {pending ? labels.entering : labels.submit}
        </button>
      </FormPanel>
    </form>
  )
}

"use client"

import Link from "next/link"
import { useActionState } from "react"
import { ArrowLeft, ArrowRight, KeyRound, Mail } from "lucide-react"
import { loginInfluencer, type InfluencerLoginState } from "@/app/influenciadores/entrar/actions"
import { Field, FormPanel, Input } from "@/components/ui/form-controls"
import { type Lang, translateFeedback, useI18n } from "@/lib/i18n"

const initialState: InfluencerLoginState = {
  ok: false,
  message: "",
  step: "email",
  email: "",
}

const loginFormCopy: Record<
  Lang,
  {
    title: string
    emailStepDescription: string
    codeStepDescription: string
    email: string
    code: string
    waiting: string
    sendCode: string
    validateCode: string
    resendCode: string
    changeEmail: string
    signupLink: string
  }
> = {
  ptBr: {
    title: "Acessar minha conta",
    emailStepDescription: "Informe o email usado no cadastro para receber seu código de acesso.",
    codeStepDescription: "Digite o código de 6 caracteres enviado para seu email cadastrado.",
    email: "Email",
    code: "Código de acesso",
    waiting: "Aguarde...",
    sendCode: "Enviar código",
    validateCode: "Validar código",
    resendCode: "Reenviar código",
    changeEmail: "Trocar email",
    signupLink: "Ainda não tenho cadastro",
  },
  ptPt: {
    title: "Aceder à minha conta",
    emailStepDescription: "Informe o email usado no registo para receber o seu código de acesso.",
    codeStepDescription: "Digite o código de 6 caracteres enviado para o seu email registado.",
    email: "Email",
    code: "Código de acesso",
    waiting: "Aguarde...",
    sendCode: "Enviar código",
    validateCode: "Validar código",
    resendCode: "Reenviar código",
    changeEmail: "Trocar email",
    signupLink: "Ainda não tenho registo",
  },
  en: {
    title: "Access my account",
    emailStepDescription: "Enter the email used in your signup to receive your access code.",
    codeStepDescription: "Enter the 6-character code sent to your registered email.",
    email: "Email",
    code: "Access code",
    waiting: "Please wait...",
    sendCode: "Send code",
    validateCode: "Validate code",
    resendCode: "Resend code",
    changeEmail: "Change email",
    signupLink: "I do not have a signup yet",
  },
  es: {
    title: "Acceder a mi cuenta",
    emailStepDescription: "Informa el email usado en el registro para recibir tu código de acceso.",
    codeStepDescription: "Introduce el código de 6 caracteres enviado a tu email registrado.",
    email: "Email",
    code: "Código de acceso",
    waiting: "Espera...",
    sendCode: "Enviar código",
    validateCode: "Validar código",
    resendCode: "Reenviar código",
    changeEmail: "Cambiar email",
    signupLink: "Aún no tengo registro",
  },
  fr: {
    title: "Accéder à mon compte",
    emailStepDescription: "Indiquez l'email utilisé lors de l'inscription pour recevoir votre code d'accès.",
    codeStepDescription: "Saisissez le code de 6 caractères envoyé à votre email enregistré.",
    email: "Email",
    code: "Code d'accès",
    waiting: "Veuillez patienter...",
    sendCode: "Envoyer le code",
    validateCode: "Valider le code",
    resendCode: "Renvoyer le code",
    changeEmail: "Changer l'email",
    signupLink: "Je n'ai pas encore d'inscription",
  },
}

export function InfluencerLoginForm() {
  const [state, formAction, pending] = useActionState(loginInfluencer, initialState)
  const { lang, t } = useI18n()
  const copy = loginFormCopy[lang]
  const isCodeStep = state.step === "code"

  return (
    <form action={formAction}>
      <FormPanel className="grid gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold text-primary">{copy.title}</h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
            {isCodeStep ? copy.codeStepDescription : copy.emailStepDescription}
          </p>
        </div>

        <input type="hidden" name="intent" value={isCodeStep ? "verify-code" : "request-code"} />

        <Field label={copy.email}>
          <Input name="email" type="email" defaultValue={state.email} readOnly={isCodeStep} required />
        </Field>

        {isCodeStep && (
          <Field label={copy.code}>
            <Input
              name="code"
              inputMode="text"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="A1B2C3"
              className="text-center font-display text-lg uppercase tracking-[0.28em]"
              required
            />
          </Field>
        )}

        {state.message && (
          <div className={state.ok ? "rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold leading-relaxed text-emerald-700" : "rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold leading-relaxed text-accent"} aria-live="polite">
            {translateFeedback(t, state.message)}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
        >
          {isCodeStep ? <KeyRound className="size-4" aria-hidden="true" /> : <Mail className="size-4" aria-hidden="true" />}
          {pending ? copy.waiting : isCodeStep ? copy.validateCode : copy.sendCode}
        </button>

        {isCodeStep && (
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              name="intent"
              value="request-code"
              formNoValidate
              disabled={pending}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary/5 px-4 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent disabled:pointer-events-none disabled:opacity-60"
            >
              {copy.resendCode}
            </button>
            <button
              type="submit"
              name="intent"
              value="change-email"
              formNoValidate
              disabled={pending}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-primary/5 px-4 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent disabled:pointer-events-none disabled:opacity-60"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {copy.changeEmail}
            </button>
          </div>
        )}

        <Link href="/influenciadores#cadastro" className="inline-flex items-center justify-center gap-1 text-xs font-extrabold text-primary transition hover:text-accent">
          {copy.signupLink} <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </FormPanel>
    </form>
  )
}

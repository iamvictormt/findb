"use client"

import { useActionState, useRef, useState } from "react"
import { CheckCircle2, Eye, X } from "lucide-react"
import type { HomeLinkFormState } from "@/app/admin/links/actions"
import { FullscreenDialog } from "@/components/findb/fullscreen-dialog"
import { LinkCards } from "@/components/findb/link-cards"
import { ToastMessage } from "@/components/findb/toast-message"
import { Field, FormPanel, Input, Select } from "@/components/ui/form-controls"
import { translateFeedback, useI18n } from "@/lib/i18n"

type HomeLinkFormValues = {
  title?: string
  subtitle?: string
  titlePtPt?: string | null
  subtitlePtPt?: string | null
  titleEn?: string | null
  subtitleEn?: string | null
  titleEs?: string | null
  subtitleEs?: string | null
  titleFr?: string | null
  subtitleFr?: string | null
  href?: string
  icon?: string
  tone?: string
  isActive?: boolean
}

type PreviewLink = {
  id: string
  title: string
  subtitle: string
  titlePtPt?: string | null
  subtitlePtPt?: string | null
  titleEn?: string | null
  subtitleEn?: string | null
  titleEs?: string | null
  subtitleEs?: string | null
  titleFr?: string | null
  subtitleFr?: string | null
  href: string
  icon: string
  tone: "blue" | "pink" | "cyan" | "green" | "gold"
  sortOrder: number
  isActive: boolean
}

const initialState: HomeLinkFormState = {
  ok: false,
  message: "",
}

const scrollTargets = ["#influenciadores", "#cartoes", "#bandeiras"]
const tones = new Set<PreviewLink["tone"]>(["blue", "pink", "cyan", "green", "gold"])

const iconOptions = [
  { value: "BadgeEuro", label: "Euro" },
  { value: "BriefcaseBusiness", label: "Maleta" },
  { value: "CalendarDays", label: "Calendário" },
  { value: "CreditCard", label: "Cartão" },
  { value: "Globe2", label: "Globo" },
  { value: "Handshake", label: "Parceria" },
  { value: "MessageCircle", label: "Mensagem" },
  { value: "Network", label: "Networking" },
  { value: "Plane", label: "Viagem" },
  { value: "UsersRound", label: "Pessoas" },
]

const toneOptions = [
  { value: "blue", label: "Azul" },
  { value: "pink", label: "Rosa" },
  { value: "cyan", label: "Violeta" },
  { value: "green", label: "Verde" },
  { value: "gold", label: "Dourado" },
]

export function HomeLinkForm({
  action,
  values,
  submitLabel,
}: {
  action: (prevState: HomeLinkFormState, formData: FormData) => Promise<HomeLinkFormState>
  values?: HomeLinkFormValues
  submitLabel: string
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(action, initialState)
  const [preview, setPreview] = useState<PreviewLink | null>(null)
  const { t } = useI18n()
  const errorMessage = translateFeedback(t, state.message)

  function openPreview() {
    if (!formRef.current) {
      return
    }

    const formData = new FormData(formRef.current)
    const tone = String(formData.get("tone") ?? "blue")

    setPreview({
      id: "preview",
      title: getFormText(formData, "title") || "Título do link",
      subtitle: getFormText(formData, "subtitle") || "Texto de apoio do card",
      titlePtPt: getFormText(formData, "titlePtPt"),
      subtitlePtPt: getFormText(formData, "subtitlePtPt"),
      titleEn: getFormText(formData, "titleEn"),
      subtitleEn: getFormText(formData, "subtitleEn"),
      titleEs: getFormText(formData, "titleEs"),
      subtitleEs: getFormText(formData, "subtitleEs"),
      titleFr: getFormText(formData, "titleFr"),
      subtitleFr: getFormText(formData, "subtitleFr"),
      href: getFormText(formData, "href") || "#",
      icon: getFormText(formData, "icon") || "BadgeEuro",
      tone: tones.has(tone as PreviewLink["tone"]) ? (tone as PreviewLink["tone"]) : "blue",
      sortOrder: 0,
      isActive: formData.get("isActive") === "on",
    })
  }

  return (
    <>
      <form ref={formRef} action={formAction}>
        <ToastMessage type={state.message ? "error" : undefined} message={state.message} />
        <FormPanel className="grid gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-primary">Dados do link</h2>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
              O português BR é o texto principal. As traduções abaixo são usadas quando o visitante troca o idioma.
            </p>
          </div>

          <Field label="Título em Português BR">
            <Input name="title" defaultValue={values?.title} required />
          </Field>

          <Field label="Texto em Português BR">
            <Input name="subtitle" defaultValue={values?.subtitle} required />
          </Field>

          <div className="rounded-lg bg-primary/5 p-3 ring-1 ring-primary/6">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Traduções opcionais
            </p>
            <div className="mt-3 grid gap-3">
              <TranslationFields
                titleLabel="Título em Português PT"
                subtitleLabel="Texto em Português PT"
                titleName="titlePtPt"
                subtitleName="subtitlePtPt"
                titleValue={values?.titlePtPt}
                subtitleValue={values?.subtitlePtPt}
              />
              <TranslationFields
                titleLabel="Título em English"
                subtitleLabel="Texto em English"
                titleName="titleEn"
                subtitleName="subtitleEn"
                titleValue={values?.titleEn}
                subtitleValue={values?.subtitleEn}
              />
              <TranslationFields
                titleLabel="Título em Spanish"
                subtitleLabel="Texto em Spanish"
                titleName="titleEs"
                subtitleName="subtitleEs"
                titleValue={values?.titleEs}
                subtitleValue={values?.subtitleEs}
              />
              <TranslationFields
                titleLabel="Título em France"
                subtitleLabel="Texto em France"
                titleName="titleFr"
                subtitleName="subtitleFr"
                titleValue={values?.titleFr}
                subtitleValue={values?.subtitleFr}
              />
            </div>
          </div>

          <Field
            label="URL de redirecionamento"
            helper="Use # para rolar até uma seção da página inicial, caminhos internos como /influenciadores, ou links completos com https://."
          >
            <Input name="href" defaultValue={values?.href} placeholder="/influenciadores" required />
          </Field>

          <div className="rounded-lg bg-primary/5 p-3 text-xs font-semibold leading-relaxed text-muted-foreground ring-1 ring-primary/6">
            <p className="font-extrabold text-primary">Seções disponíveis para rolagem:</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {scrollTargets.map((target) => (
                <code key={target} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-accent ring-1 ring-primary/8">
                  {target}
                </code>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Ícone">
              <Select name="icon" defaultValue={values?.icon ?? "BadgeEuro"} options={iconOptions} required />
            </Field>

            <Field label="Cor">
              <Select name="tone" defaultValue={values?.tone ?? "blue"} options={toneOptions} required />
            </Field>

            <label className="flex min-h-10 items-center gap-2 self-end rounded-lg bg-primary/5 px-3 py-2 text-xs font-bold text-primary ring-1 ring-primary/6">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={values?.isActive ?? true}
                className="size-4 accent-[var(--accent)]"
              />
              Ativo na página inicial
            </label>
          </div>

          {state.message && (
            <div className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold leading-relaxed text-accent" aria-live="polite">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={openPreview}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary/5 px-4 text-sm font-extrabold text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
            >
              <Eye className="size-4" aria-hidden="true" />
              Pré-visualizar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {pending ? "Salvando..." : submitLabel}
            </button>
          </div>
        </FormPanel>
      </form>

      {preview && (
        <FullscreenDialog labelledBy="home-link-preview-title">
          <div className="w-full rounded-[1.2rem] bg-white/96 p-4 shadow-[0_28px_70px_-34px_rgba(33,33,156,0.88)] ring-1 ring-white/90 backdrop-blur-xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                  Pré-visualização
                </p>
                <h3 id="home-link-preview-title" className="mt-1 font-display text-xl font-extrabold leading-tight text-primary">
                  Como ficará na página inicial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/5 text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
                aria-label="Fechar"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,248,255,0.72))] p-3 ring-1 ring-primary/6">
              <LinkCards links={[preview]} />
            </div>

            {!preview.isActive && (
              <p className="mt-3 rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold leading-relaxed text-accent">
                Este link está marcado como inativo, então não aparecerá na página inicial até ser ativado.
              </p>
            )}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-primary/5 px-4 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
              >
                Alterar dados
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreview(null)
                  formRef.current?.requestSubmit()
                }}
                disabled={pending}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                {pending ? "Salvando..." : submitLabel}
              </button>
            </div>
          </div>
        </FullscreenDialog>
      )}
    </>
  )
}

function TranslationFields({
  titleLabel,
  subtitleLabel,
  titleName,
  subtitleName,
  titleValue,
  subtitleValue,
}: {
  titleLabel: string
  subtitleLabel: string
  titleName: string
  subtitleName: string
  titleValue?: string | null
  subtitleValue?: string | null
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Field label={titleLabel}>
        <Input name={titleName} defaultValue={titleValue ?? undefined} />
      </Field>
      <Field label={subtitleLabel}>
        <Input name={subtitleName} defaultValue={subtitleValue ?? undefined} />
      </Field>
    </div>
  )
}

function getFormText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

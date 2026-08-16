"use client"

import { useActionState } from "react"
import { CheckCircle2 } from "lucide-react"
import type { DocumentFormState } from "@/app/admin/documentos/actions"
import { ToastMessage } from "@/components/findb/toast-message"
import { Field, FormPanel, Input, Select, Textarea } from "@/components/ui/form-controls"
import { translateFeedback, useI18n } from "@/lib/i18n"

type DocumentFormValues = {
  title?: string
  description?: string
  type?: string
  url?: string
}

type DocumentFormLabels = {
  formTitle: string
  formDescription: string
  title: string
  description: string
  type: string
  documentUrl: string
  documentUrlHelper: string
  saving: string
  types: {
    regulation: string
    material: string
    submission: string
    story: string
    script: string
    brand: string
    other: string
  }
}

const initialState: DocumentFormState = {
  ok: false,
  message: "",
}

export function DocumentForm({
  action,
  values,
  submitLabel,
  labels,
}: {
  action: (prevState: DocumentFormState, formData: FormData) => Promise<DocumentFormState>
  values?: DocumentFormValues
  submitLabel: string
  labels: DocumentFormLabels
}) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const { t } = useI18n()
  const errorMessage = translateFeedback(t, state.message)
  const typeOptions = [
    { value: "REGULATION", label: labels.types.regulation },
    { value: "MATERIAL", label: labels.types.material },
    { value: "SUBMISSION", label: labels.types.submission },
    { value: "STORY", label: labels.types.story },
    { value: "SCRIPT", label: labels.types.script },
    { value: "BRAND", label: labels.types.brand },
    { value: "OTHER", label: labels.types.other },
  ]

  return (
    <form action={formAction}>
      <ToastMessage type={state.message ? "error" : undefined} message={state.message} />
      <FormPanel className="grid gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold text-primary">{labels.formTitle}</h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
            {labels.formDescription}
          </p>
        </div>

        <Field label={labels.title}>
          <Input name="title" defaultValue={values?.title} required />
        </Field>

        <Field label={labels.description}>
          <Textarea name="description" defaultValue={values?.description} rows={3} required />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={labels.type}>
            <Select name="type" defaultValue={values?.type ?? "MATERIAL"} options={typeOptions} required />
          </Field>

          <Field label={labels.documentUrl} helper={labels.documentUrlHelper}>
            <Input name="url" defaultValue={values?.url} placeholder="https://..." required />
          </Field>
        </div>

        {state.message && (
          <div className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold leading-relaxed text-accent" aria-live="polite">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {pending ? labels.saving : submitLabel}
        </button>
      </FormPanel>
    </form>
  )
}

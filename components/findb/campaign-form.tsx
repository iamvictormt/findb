"use client"

import { useActionState, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import type { CampaignFormState } from "@/app/admin/campanhas/actions"
import { ToastMessage } from "@/components/findb/toast-message"
import { DateInput, EuroMoneyInput, Field, FormPanel, Input, Select, Textarea } from "@/components/ui/form-controls"
import { translateFeedback, useI18n } from "@/lib/i18n"

type CampaignFormValues = {
  title?: string
  description?: string
  objective?: string
  rewardCents?: number
  materialType?: string
  status?: string
  startsAt?: Date
  endsAt?: Date | null
}

type CampaignFormLabels = {
  formTitle: string
  formDescription: string
  title: string
  description: string
  objective: string
  rewardEuros: string
  materialType: string
  status: string
  active: string
  paused: string
  ended: string
  draft: string
  eventMaterial: string
  startDate: string
  endDate: string
  endDateHelper: string
  saving: string
}

const initialState: CampaignFormState = {
  ok: false,
  message: "",
}

export function CampaignForm({
  action,
  values,
  submitLabel,
  labels,
}: {
  action: (prevState: CampaignFormState, formData: FormData) => Promise<CampaignFormState>
  values?: CampaignFormValues
  submitLabel: string
  labels: CampaignFormLabels
}) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const today = formatDateInput(new Date())
  const initialStartDate = formatDateInput(values?.startsAt ?? new Date())
  const [startDate, setStartDate] = useState(initialStartDate < today ? today : initialStartDate)
  const [endDateResetKey, setEndDateResetKey] = useState(0)
  const { t } = useI18n()
  const errorMessage = translateFeedback(t, state.message)
  const endDateDefaultValue = endDateResetKey === 0 ? formatDateInput(values?.endsAt) : ""
  const statusOptions = [
    { value: "ACTIVE", label: labels.active },
    { value: "PAUSED", label: labels.paused },
    { value: "ENDED", label: labels.ended },
    { value: "DRAFT", label: labels.draft },
  ]
  const materialOptions = [
    { value: "Stories", label: "Stories" },
    { value: "Reels", label: "Reels" },
    { value: "Link", label: "Link" },
    { value: "Post", label: "Post" },
    { value: "Live", label: "Live" },
    { value: "Evento", label: labels.eventMaterial },
  ]

  return (
    <form action={formAction} noValidate>
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

        <Field label={labels.objective}>
          <Textarea name="objective" defaultValue={values?.objective} rows={3} required />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={labels.rewardEuros}>
            <EuroMoneyInput
              name="rewardEuros"
              defaultValue={values?.rewardCents ? String(values.rewardCents / 100) : ""}
              maxCents={100_000_000}
              required
            />
          </Field>

          <Field label={labels.materialType}>
            <Select name="materialType" defaultValue={values?.materialType ?? "Stories"} options={materialOptions} required />
          </Field>

          <div className="grid gap-3 sm:col-span-2 lg:grid-cols-3">
            <Field label={labels.status}>
              <Select name="status" defaultValue={values?.status ?? "ACTIVE"} options={statusOptions} required />
            </Field>

            <Field label={labels.startDate}>
              <DateInput
                name="startsAt"
                defaultValue={startDate}
                min={today}
                onValueChange={(value) => {
                  if (value && value !== startDate) {
                    setStartDate(value)
                    setEndDateResetKey((current) => current + 1)
                  }
                }}
                required
              />
            </Field>

            <Field label={labels.endDate}>
              <DateInput
                key={`${startDate}-${endDateResetKey}`}
                name="endsAt"
                defaultValue={endDateDefaultValue}
                min={startDate}
              />
            </Field>

            <p className="text-[11px] font-semibold leading-relaxed text-muted-foreground lg:col-span-3">
              {labels.endDateHelper}
            </p>
          </div>
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

function formatDateInput(date?: Date | null) {
  if (!date) {
    return ""
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

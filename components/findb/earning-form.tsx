"use client"

import { useActionState } from "react"
import { BadgeEuro } from "lucide-react"
import { createEarning, type EarningFormState } from "@/app/admin/ganhos/actions"
import { ToastMessage } from "@/components/findb/toast-message"
import { Field, FormPanel, NumericInput, Select, Textarea } from "@/components/ui/form-controls"

type Option = {
  value: string
  label: string
}

type EarningFormLabels = {
  formTitle: string
  formDescription: string
  influencer: string
  select: string
  campaign: string
  noCampaign: string
  amountEuros: string
  status: string
  pending: string
  available: string
  paid: string
  canceled: string
  description: string
  example: string
  saving: string
  submit: string
}

const initialState: EarningFormState = {
  ok: false,
  message: "",
}

export function EarningForm({
  influencers,
  campaigns,
  labels,
}: {
  influencers: Option[]
  campaigns: Option[]
  labels: EarningFormLabels
}) {
  const [state, formAction, pending] = useActionState(createEarning, initialState)
  const statusOptions = [
    { value: "PENDING", label: labels.pending },
    { value: "AVAILABLE", label: labels.available },
    { value: "PAID", label: labels.paid },
    { value: "CANCELED", label: labels.canceled },
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

        <Field label={labels.influencer}>
          <Select name="influencerId" placeholder={labels.select} options={influencers} required />
        </Field>

        <Field label={labels.campaign}>
          <Select
            name="campaignId"
            placeholder={labels.noCampaign}
            options={[{ value: "", label: labels.noCampaign }, ...campaigns]}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={labels.amountEuros}>
            <NumericInput name="amountEuros" maxLength={8} required />
          </Field>

          <Field label={labels.status}>
            <Select name="status" defaultValue="PENDING" options={statusOptions} required />
          </Field>
        </div>

        <Field label={labels.description}>
          <Textarea name="description" rows={3} placeholder={labels.example} required />
        </Field>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
        >
          <BadgeEuro className="size-4" aria-hidden="true" />
          {pending ? labels.saving : labels.submit}
        </button>
      </FormPanel>
    </form>
  )
}

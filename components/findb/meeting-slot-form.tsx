"use client"

import { useActionState } from "react"
import { CalendarPlus } from "lucide-react"
import type { MeetingSlotFormState } from "@/app/admin/agendamentos/actions"
import { ToastMessage } from "@/components/findb/toast-message"
import { DateInput, Field, FormPanel, Select, Textarea, TimeInput } from "@/components/ui/form-controls"
import { translateFeedback, useI18n } from "@/lib/i18n"

const initialState: MeetingSlotFormState = {
  ok: false,
  message: "",
}

export function MeetingSlotForm({
  action,
  labels,
}: {
  action: (prevState: MeetingSlotFormState, formData: FormData) => Promise<MeetingSlotFormState>
  labels: {
    formTitle: string
    formDescription: string
    date: string
    time: string
    duration: string
    durationOptions: Array<{ value: string; label: string }>
    internalNote: string
    optional: string
    saving: string
    createSlot: string
  }
}) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const { t } = useI18n()
  const errorMessage = translateFeedback(t, state.message)
  const today = formatDateInput(new Date())

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

        <div className="grid gap-3 sm:grid-cols-[1fr_0.75fr_0.8fr]">
          <Field label={labels.date}>
            <DateInput name="date" min={today} required />
          </Field>
          <Field label={labels.time}>
            <TimeInput name="time" required />
          </Field>
          <Field label={labels.duration}>
            <Select
              name="durationMinutes"
              defaultValue="30"
              options={labels.durationOptions}
              required
            />
          </Field>
        </div>

        <Field label={labels.internalNote} helper={labels.optional}>
          <Textarea name="note" rows={3} />
        </Field>

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
          <CalendarPlus className="size-4" aria-hidden="true" />
          {pending ? labels.saving : labels.createSlot}
        </button>
      </FormPanel>
    </form>
  )
}

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

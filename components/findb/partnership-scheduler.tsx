"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { ArrowRight, CalendarCheck2, CheckCircle2, Clock3, LockKeyhole, Mail, MessageCircle, UserRound } from "lucide-react"
import type { BookingFormState } from "@/app/agendamento/actions"
import { ToastMessage } from "@/components/findb/toast-message"
import { Field, FormPanel, Input, Select, Textarea } from "@/components/ui/form-controls"
import { allCountriesSlotValue } from "@/lib/meeting-countries"
import { getLocalizedAcceptedCountries } from "@/lib/influencer-program"
import { formatLisbonDateLong, formatLisbonTime } from "@/lib/scheduling"
import { translateFeedback, useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type Slot = {
  id: string
  startsAt: string
  endsAt: string
  country: string
}

type DayGroup = {
  key: string
  date: string
  slots: Slot[]
}

const initialState: BookingFormState = {
  ok: false,
  message: "",
}

export function PartnershipScheduler({
  slots,
  action,
}: {
  slots: Slot[]
  action: (prevState: BookingFormState, formData: FormData) => Promise<BookingFormState>
}) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const { lang, t } = useI18n()
  const [selectedCountry, setSelectedCountry] = useState("")
  const countryOptions = useMemo(() => getLocalizedAcceptedCountries(lang, "Outro país europeu"), [lang])
  const filteredSlots = useMemo(() => {
    if (!selectedCountry) {
      return slots
    }

    return slots.filter((slot) => slot.country === allCountriesSlotValue || slot.country === selectedCountry)
  }, [selectedCountry, slots])
  const groups = useMemo(() => groupSlotsByDay(filteredSlots), [filteredSlots])
  const [selectedDay, setSelectedDay] = useState(groups[0]?.key ?? "")
  const selectedGroup = groups.find((group) => group.key === selectedDay) ?? groups[0]
  const [selectedSlotId, setSelectedSlotId] = useState("")
  const selectedSlot = filteredSlots.find((slot) => slot.id === selectedSlotId) ?? selectedGroup?.slots[0]
  const errorMessage = translateFeedback(t, state.message)

  useEffect(() => {
    const nextGroup = groups[0]
    setSelectedDay(nextGroup?.key ?? "")
    setSelectedSlotId(nextGroup?.slots[0]?.id ?? "")
  }, [groups])

  function chooseDay(dayKey: string) {
    const day = groups.find((group) => group.key === dayKey)
    setSelectedDay(dayKey)
    setSelectedSlotId(day?.slots[0]?.id ?? "")
  }

  if (!slots.length) {
    return (
      <FormPanel className="grid gap-3 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/10 text-accent">
          <CalendarCheck2 className="size-6" aria-hidden="true" />
        </span>
        <h2 className="font-display text-xl font-extrabold text-primary">Nenhum horário disponível agora</h2>
        <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
          A equipe ainda não liberou novos horários para conversa. Volte em breve para escolher uma data.
        </p>
      </FormPanel>
    )
  }

  return (
    <form action={formAction} noValidate className="grid gap-4">
      <ToastMessage type={state.message ? "error" : undefined} message={state.message} />
      <input type="hidden" name="slotId" value={selectedSlot?.id ?? ""} readOnly />

      <FormPanel className="grid gap-4">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            Passo 1
          </p>
          <h2 className="font-display text-xl font-extrabold text-primary">Escolha seu país e uma data</h2>
        </div>

        <Field label="País de residência">
          <Select
            name="country"
            required
            placeholder="Selecione"
            options={countryOptions}
            onValueChange={setSelectedCountry}
          />
        </Field>

        {groups.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {groups.map((group) => {
              const date = new Date(group.date)
              const active = group.key === selectedGroup?.key

              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => chooseDay(group.key)}
                  className={cn(
                    "grid min-h-[74px] content-center gap-1 rounded-lg bg-primary/5 px-3 py-2 text-left ring-1 ring-primary/6 transition hover:bg-white hover:ring-accent/20",
                    active && "bg-primary text-white shadow-[0_16px_32px_-22px_rgba(33,33,156,0.9)] ring-primary",
                  )}
                >
                  <span className={cn("text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground", active && "text-white/75")}>
                    {formatLisbonWeekday(date)}
                  </span>
                  <span className="font-display text-lg font-extrabold leading-none">
                    {formatLisbonDayMonth(date)}
                  </span>
                  <span className={cn("text-[11px] font-bold text-muted-foreground", active && "text-white/75")}>
                    {group.slots.length} horario{group.slots.length === 1 ? "" : "s"}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg bg-primary/5 px-3 py-3 text-xs font-bold leading-relaxed text-muted-foreground ring-1 ring-primary/6">
            Nenhum horário disponível para esse país no momento.
          </div>
        )}
      </FormPanel>

      {groups.length > 0 && (
      <FormPanel className="grid gap-4">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            Passo 2
          </p>
          <h2 className="font-display text-xl font-extrabold text-primary">Escolha o horário</h2>
          {selectedGroup && (
            <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground capitalize">
              {formatLisbonDateLong(new Date(selectedGroup.date))}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {selectedGroup?.slots.map((slot) => {
            const active = slot.id === selectedSlot?.id

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary/5 px-3 text-xs font-extrabold text-primary ring-1 ring-primary/6 transition hover:bg-white hover:text-accent hover:ring-accent/20",
                  active && "bg-accent text-white shadow-[0_14px_28px_-20px_rgba(217,56,95,0.95)] ring-accent hover:bg-accent hover:text-white",
                )}
              >
                <Clock3 className="size-3.5" aria-hidden="true" />
                <span>{formatLisbonTime(new Date(slot.startsAt))}</span>
                {slot.country !== allCountriesSlotValue && (
                  <span className="max-w-20 truncate text-[10px] opacity-75">{slot.country}</span>
                )}
              </button>
            )
          })}
        </div>
      </FormPanel>
      )}

      <FormPanel className="grid gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            Passo 3
          </p>
          <h2 className="font-display text-xl font-extrabold text-primary">Seus dados</h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
            Confirmaremos os detalhes por email ou WhatsApp.
          </p>
        </div>

        <Field label="Nome completo">
          <span className="relative block">
            <Input name="name" required className="pl-10" />
            <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
          </span>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="E-mail">
            <span className="relative block">
              <Input name="email" type="email" required className="pl-10" />
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
            </span>
          </Field>
          <Field label="WhatsApp">
            <span className="relative block">
              <Input name="whatsapp" inputMode="tel" required placeholder="+351 912 345 678" className="pl-10" />
              <MessageCircle className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
            </span>
          </Field>
        </div>

        <Field label="Empresa ou projeto" helper="Opcional">
          <Input name="company" />
        </Field>

        <Field label="Conte-nos brevemente sobre a parceria" helper="Opcional">
          <Textarea name="message" rows={4} />
        </Field>

        {selectedSlot && (
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs font-bold leading-relaxed text-primary ring-1 ring-primary/6">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              Horário selecionado: {formatLisbonDateLong(new Date(selectedSlot.startsAt))}, {formatLisbonTime(new Date(selectedSlot.startsAt))}.
              {selectedSlot.country !== allCountriesSlotValue ? ` País: ${selectedSlot.country}.` : ""}
              Apenas horários liberados pela equipe são aceitos.
            </span>
          </div>
        )}

        {state.message && (
          <div className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold leading-relaxed text-accent" aria-live="polite">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={pending || !selectedSlot}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? (
            <>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Confirmando...
            </>
          ) : (
            <>
              Começar agendamento
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </FormPanel>
    </form>
  )
}

function groupSlotsByDay(slots: Slot[]): DayGroup[] {
  const groups = new Map<string, DayGroup>()

  for (const slot of slots) {
    const date = new Date(slot.startsAt)
    const key = formatLisbonDateKey(date)

    if (!groups.has(key)) {
      groups.set(key, { key, date: date.toISOString(), slots: [] })
    }

    groups.get(key)?.slots.push(slot)
  }

  return Array.from(groups.values())
}

function formatLisbonDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return `${values.year}-${values.month}-${values.day}`
}

function formatLisbonWeekday(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
  }).format(date)
}

function formatLisbonDayMonth(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "short",
  }).format(date)
}

"use client"

import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"

export function Field({
  label,
  helper,
  error,
  children,
  className,
}: {
  label: string
  helper?: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn("grid content-start gap-1.5 text-xs font-bold text-primary", className)}>
      <span>{label}</span>
      {children}
      {helper && !error && <span className="text-[11px] font-semibold leading-relaxed text-muted-foreground">{helper}</span>}
      {error && <span className="text-[11px] font-extrabold leading-relaxed text-accent">{error}</span>}
    </label>
  )
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-primary/10 bg-white px-3 text-sm font-semibold text-foreground shadow-[0_8px_18px_-18px_rgba(33,33,156,0.45)] outline-none transition placeholder:text-muted-foreground/70 hover:border-primary/18 focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:pointer-events-none disabled:bg-muted disabled:opacity-70",
        className,
      )}
      {...props}
    />
  )
}

export function MaskedInput({
  className,
  mask,
  validator,
  defaultValue,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "defaultValue"> & {
  mask: (value: string) => string
  validator?: (value: string) => boolean
  defaultValue?: string | number | readonly string[]
  value?: string | number | readonly string[]
}) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(() => mask(String(defaultValue ?? "")))
  const currentValue = isControlled ? mask(String(value ?? "")) : internalValue

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = mask(event.target.value)

    if (validator && !validator(nextValue)) {
      return
    }

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    event.target.value = nextValue
    onChange?.(event)
  }

  return (
    <Input
      className={className}
      value={currentValue}
      onChange={handleChange}
      {...props}
    />
  )
}

export function NumericInput({
  maxLength,
  validator,
  ...props
}: Omit<React.ComponentProps<typeof MaskedInput>, "mask">) {
  return (
    <MaskedInput
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={maxLength}
      mask={(value) => value.replace(/\D/g, "").slice(0, maxLength)}
      validator={(value) => /^\d*$/.test(value) && (validator ? validator(value) : true)}
      {...props}
    />
  )
}

export function DateInput({
  name,
  defaultValue,
  min,
  required,
  disabled,
  placeholder = "dd/mm/aaaa",
  className,
  onValueChange,
}: {
  name: string
  defaultValue?: string
  min?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  onValueChange?: (value: string) => void
}) {
  const rootRef = React.useRef<HTMLSpanElement>(null)
  const [open, setOpen] = React.useState(false)
  const [displayValue, setDisplayValue] = React.useState(() => formatDisplayDate(defaultValue ?? ""))
  const [visibleMonth, setVisibleMonth] = React.useState(() => getInitialCalendarMonth(defaultValue ?? ""))
  const [dropdownStyle, setDropdownStyle] = React.useState<{
    placement: "top" | "bottom"
    maxHeight: number
  }>({
    placement: "bottom",
    maxHeight: 320,
  })
  const minDate = min ? parseIsoDateToDate(min) : null
  const parsedDisplayDate = parseDisplayDateToDate(displayValue)
  const isoValue = parsedDisplayDate ? formatDateObjectIso(parsedDisplayDate) : ""
  const validIsoValue = parsedDisplayDate && !isBeforeDay(parsedDisplayDate, minDate) ? isoValue : ""
  const hasInvalidDisplayValue = Boolean(displayValue) && (!parsedDisplayDate || isBeforeDay(parsedDisplayDate, minDate))
  const selectedDate = parseDisplayDateToDate(displayValue)
  const calendarDays = getCalendarDays(visibleMonth)

  const updateDropdownPosition = React.useCallback(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const rect = root.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const gap = 8
    const edgePadding = 12
    const preferredHeight = 320
    const minimumHeight = 260
    const spaceBelow = viewportHeight - rect.bottom - edgePadding
    const spaceAbove = rect.top - edgePadding
    const placement = spaceBelow >= minimumHeight || spaceBelow >= spaceAbove ? "bottom" : "top"
    const availableSpace = placement === "bottom" ? spaceBelow : spaceAbove

    setDropdownStyle({
      placement,
      maxHeight: Math.max(minimumHeight, Math.min(preferredHeight, availableSpace - gap)),
    })
  }, [])

  React.useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  React.useEffect(() => {
    if (!open) {
      return
    }

    updateDropdownPosition()
    window.addEventListener("resize", updateDropdownPosition)
    window.addEventListener("scroll", updateDropdownPosition, true)

    return () => {
      window.removeEventListener("resize", updateDropdownPosition)
      window.removeEventListener("scroll", updateDropdownPosition, true)
    }
  }, [open, updateDropdownPosition])

  React.useEffect(() => {
    onValueChange?.(validIsoValue)
  }, [validIsoValue, onValueChange])

  function handleDisplayChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = maskDisplayDate(event.target.value)
    const nextDate = parseDisplayDateToDate(nextValue)

    setDisplayValue(nextValue)

    if (nextDate) {
      setVisibleMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1))
    }
  }

  function selectDate(date: Date) {
    if (isBeforeDay(date, minDate)) {
      return
    }

    setDisplayValue(formatDateObjectDisplay(date))
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    setOpen(false)
  }

  function moveMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  return (
    <span ref={rootRef} className="relative block">
      <input name={name} type="hidden" value={validIsoValue} readOnly />
      <input name={`${name}Invalid`} type="hidden" value={hasInvalidDisplayValue ? "1" : ""} readOnly />
      <Input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required={required}
        disabled={disabled}
        pattern="\d{2}/\d{2}/\d{4}"
        placeholder={placeholder}
        value={displayValue}
        onFocus={() => {
          updateDropdownPosition()
          setOpen(true)
        }}
        onChange={handleDisplayChange}
        className={cn("pr-10", className)}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label="Abrir calendário"
        onClick={() => {
          updateDropdownPosition()
          setOpen((current) => !current)
        }}
        className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-accent/8 text-accent transition hover:bg-accent/14 disabled:pointer-events-none disabled:opacity-60"
      >
        <CalendarDays className="size-4" aria-hidden="true" />
      </button>

      {open && (
        <span
          style={{ maxHeight: dropdownStyle.maxHeight }}
          className={cn(
            "absolute left-0 z-50 block w-[18.5rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-white/85 bg-white/98 p-3 text-primary shadow-[0_24px_70px_-34px_rgba(33,33,156,0.95)] ring-1 ring-primary/8 backdrop-blur-xl",
            dropdownStyle.placement === "bottom" ? "top-[calc(100%+0.45rem)]" : "bottom-[calc(100%+0.45rem)]",
          )}
        >
          <span className="mb-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="grid size-8 place-items-center rounded-full bg-accent/8 text-accent transition hover:bg-accent/14"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="text-center font-display text-sm font-extrabold capitalize">
              {formatCalendarMonth(visibleMonth)}
            </span>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="grid size-8 place-items-center rounded-full bg-accent/8 text-accent transition hover:bg-accent/14"
              aria-label="Próximo mês"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </span>

          <span className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((weekday, index) => (
              <span key={`${weekday}-${index}`} className="grid h-6 place-items-center">
                {weekday}
              </span>
            ))}
          </span>

          <span className="mt-1 grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false
              const isCurrentMonth = day.date.getMonth() === visibleMonth.getMonth()
              const isToday = isSameDay(day.date, new Date())
              const isDisabled = isBeforeDay(day.date, minDate)

              return (
                <button
                  key={day.date.toISOString()}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => selectDate(day.date)}
                  className={cn(
                    "grid size-8 place-items-center rounded-full text-xs font-extrabold transition",
                    isCurrentMonth ? "text-primary" : "text-muted-foreground/45",
                    isToday && !isSelected && !isDisabled && "bg-accent/8 text-accent",
                    isSelected && !isDisabled ? "bg-accent text-white shadow-[0_10px_22px_-14px_rgba(216,51,96,0.9)]" : "hover:bg-accent/10 hover:text-accent",
                    isDisabled && "pointer-events-none text-muted-foreground/25 line-through opacity-60",
                  )}
                >
                  {day.date.getDate()}
                </button>
              )
            })}
          </span>
        </span>
      )}
    </span>
  )
}

export function EuroMoneyInput({
  name,
  defaultValue,
  required,
  disabled,
  placeholder = "€ 0,00",
  className,
  maxCents,
}: {
  name: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  maxCents?: number
}) {
  const [displayValue, setDisplayValue] = React.useState(() =>
    formatEuroDisplay(clampEuroCents(parseEuroCents(defaultValue ?? ""), maxCents)),
  )
  const cents = clampEuroCents(parseEuroCents(displayValue), maxCents)
  const decimalValue = cents ? (cents / 100).toFixed(2) : ""

  return (
    <span className="relative block">
      <input name={name} type="hidden" value={decimalValue} readOnly />
      <Input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={displayValue}
        onChange={(event) => {
          const nextCents = clampEuroCents(parseEuroMaskCents(event.target.value), maxCents)
          setDisplayValue(formatEuroDisplay(nextCents))
        }}
        className={cn("pr-10", className)}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-accent/8 font-display text-xs font-extrabold text-accent">
        €
      </span>
    </span>
  )
}

function parseEuroCents(value: string) {
  const trimmed = value.trim().replace(/\s/g, "").replace(/^€/, "")

  if (!trimmed) {
    return 0
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed) * 100
  }

  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed

  if (/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return Math.round(Number(normalized) * 100)
  }

  const digits = trimmed.replace(/\D/g, "")
  return digits ? Number(digits) * 100 : 0
}

function parseEuroMaskCents(value: string) {
  const digits = value.replace(/\D/g, "")
  return digits ? Number(digits) : 0
}

function clampEuroCents(cents: number, maxCents?: number) {
  if (!Number.isFinite(cents) || cents <= 0) {
    return 0
  }

  return typeof maxCents === "number" ? Math.min(cents, maxCents) : cents
}

function formatEuroDisplay(cents: number) {
  if (!cents) {
    return ""
  }

  const amount = (cents / 100).toFixed(2)
  const [euros, centsPart] = amount.split(".")
  const groupedEuros = euros.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return `€ ${groupedEuros},${centsPart}`
}

function maskDisplayDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  return [day, month, year].filter(Boolean).join("/")
}

function formatDisplayDate(value: string) {
  if (!value) {
    return ""
  }

  const [year, month, day] = value.split("-")

  return year && month && day ? `${day}/${month}/${year}` : maskDisplayDate(value)
}

function getInitialCalendarMonth(value: string) {
  const date = parseDisplayDateToDate(formatDisplayDate(value)) ?? new Date()
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function parseDisplayDate(value: string) {
  const date = parseDisplayDateToDate(value)
  return date ? formatDateObjectIso(date) : ""
}

function parseDisplayDateToDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)

  if (!match) {
    return null
  }

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  const valid =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)

  return valid ? date : null
}

function parseIsoDateToDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  const valid =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)

  return valid ? date : null
}

function formatDateObjectDisplay(date: Date) {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear())

  return `${day}/${month}/${year}`
}

function formatDateObjectIso(date: Date) {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear())

  return `${year}-${month}-${day}`
}

function formatCalendarMonth(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date)
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return { date }
  })
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function isBeforeDay(first: Date, second: Date | null) {
  if (!second) {
    return false
  }

  const firstDay = new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime()
  const secondDay = new Date(second.getFullYear(), second.getMonth(), second.getDate()).getTime()

  return firstDay < secondDay
}

export function SocialHandleInput({
  maxLength = 32,
  ...props
}: Omit<React.ComponentProps<typeof MaskedInput>, "mask">) {
  return (
    <MaskedInput
      maxLength={maxLength}
      placeholder="@seuperfil"
      mask={(value) => {
        const handle = value
          .replace(/\s/g, "")
          .replace(/@/g, "")
          .replace(/[^A-Za-z0-9._-]/g, "")
          .slice(0, Math.max(maxLength - 1, 1))

        return `@${handle}`
      }}
      validator={(value) => value.startsWith("@")}
      {...props}
    />
  )
}

type PhonePreset = {
  prefix: string
  groups: number[]
  placeholder: string
}

const defaultPhonePreset: PhonePreset = {
  prefix: "+",
  groups: [3, 3, 3, 3],
  placeholder: "+00 000 000 000",
}

const phonePresetsByCountry: Record<string, PhonePreset> = {
  Portugal: { prefix: "+351", groups: [3, 3, 3], placeholder: "+351 912 345 678" },
  Irlanda: { prefix: "+353", groups: [2, 3, 4], placeholder: "+353 83 123 4567" },
  Espanha: { prefix: "+34", groups: [3, 3, 3], placeholder: "+34 612 345 678" },
  França: { prefix: "+33", groups: [1, 2, 2, 2, 2], placeholder: "+33 6 12 34 56 78" },
  Itália: { prefix: "+39", groups: [3, 3, 4], placeholder: "+39 312 345 6789" },
  Alemanha: { prefix: "+49", groups: [3, 3, 4], placeholder: "+49 151 234 5678" },
  "Países Baixos": { prefix: "+31", groups: [1, 4, 4], placeholder: "+31 6 1234 5678" },
  Bélgica: { prefix: "+32", groups: [3, 2, 2, 2], placeholder: "+32 470 12 34 56" },
  Luxemburgo: { prefix: "+352", groups: [3, 3, 3], placeholder: "+352 621 123 456" },
  Suíça: { prefix: "+41", groups: [2, 3, 2, 2], placeholder: "+41 78 123 45 67" },
  Áustria: { prefix: "+43", groups: [3, 3, 4], placeholder: "+43 660 123 4567" },
  Suécia: { prefix: "+46", groups: [2, 3, 2, 2], placeholder: "+46 70 123 45 67" },
  Noruega: { prefix: "+47", groups: [3, 2, 3], placeholder: "+47 412 34 567" },
  Dinamarca: { prefix: "+45", groups: [2, 2, 2, 2], placeholder: "+45 12 34 56 78" },
  Finlândia: { prefix: "+358", groups: [2, 3, 4], placeholder: "+358 40 123 4567" },
  Polônia: { prefix: "+48", groups: [3, 3, 3], placeholder: "+48 512 345 678" },
  "República Tcheca": { prefix: "+420", groups: [3, 3, 3], placeholder: "+420 601 234 567" },
  "Outro país europeu": { prefix: "+", groups: [3, 3, 3, 3], placeholder: "+00 000 000 000" },
}

export function WhatsAppInput({
  country,
  className,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  country?: string
}) {
  const preset = country ? phonePresetsByCountry[country] ?? defaultPhonePreset : defaultPhonePreset
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    setValue((currentValue) => formatPhoneValue(currentValue, preset))
  }, [preset])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = formatPhoneValue(event.target.value, preset)
    setValue(nextValue)
    event.target.value = nextValue
    onChange?.(event)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const deleting = event.key === "Backspace" || event.key === "Delete"
    const selectionStart = input.selectionStart ?? 0
    const selectionEnd = input.selectionEnd ?? 0
    const allSelected = selectionStart === 0 && selectionEnd === input.value.length
    const nationalDigits = getNationalPhoneDigits(input.value, preset)

    if (deleting && (allSelected || nationalDigits.length <= 1)) {
      event.preventDefault()
      setValue("")
      input.value = ""
    }
  }

  return (
    <Input
      className={className}
      inputMode="tel"
      placeholder={preset.placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

function formatPhoneValue(value: string, preset: PhonePreset) {
  const nationalDigits = getNationalPhoneDigits(value, preset)
  const maxLength = preset.groups.reduce((total, group) => total + group, 0)
  const limitedDigits = nationalDigits.slice(0, maxLength)
  const formattedGroups: string[] = []
  let cursor = 0

  for (const groupLength of preset.groups) {
    const group = limitedDigits.slice(cursor, cursor + groupLength)

    if (!group) {
      break
    }

    formattedGroups.push(group)
    cursor += groupLength
  }

  if (!preset.prefix || preset.prefix === "+") {
    return limitedDigits ? `+${formattedGroups.join(" ")}` : ""
  }

  return formattedGroups.length ? `${preset.prefix} ${formattedGroups.join(" ")}` : ""
}

function getNationalPhoneDigits(value: string, preset: PhonePreset) {
  const digits = value.replace(/\D/g, "")
  const prefixDigits = preset.prefix.replace(/\D/g, "")

  if (!digits || (prefixDigits && prefixDigits.startsWith(digits))) {
    return ""
  }

  return digits.startsWith(prefixDigits)
    ? digits.slice(prefixDigits.length)
    : digits
}

export type SelectOption = {
  value: string
  label: string
}

export function Select({
  name,
  options,
  placeholder = "Selecione",
  defaultValue = "",
  required,
  disabled,
  className,
  onValueChange,
}: {
  name: string
  options: SelectOption[]
  placeholder?: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
  className?: string
  onValueChange?: (value: string) => void
}) {
  const id = React.useId()
  const rootRef = React.useRef<HTMLSpanElement>(null)
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  const [dropdownStyle, setDropdownStyle] = React.useState<{
    placement: "top" | "bottom"
    maxHeight: number
  }>({
    placement: "bottom",
    maxHeight: 256,
  })
  const selected = options.find((option) => option.value === value)

  const updateDropdownPosition = React.useCallback(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const rect = root.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const gap = 6
    const edgePadding = 12
    const preferredHeight = 256
    const minimumHeight = 140
    const spaceBelow = viewportHeight - rect.bottom - edgePadding
    const spaceAbove = rect.top - edgePadding
    const placement = spaceBelow >= minimumHeight || spaceBelow >= spaceAbove ? "bottom" : "top"
    const availableSpace = placement === "bottom" ? spaceBelow : spaceAbove

    setDropdownStyle({
      placement,
      maxHeight: Math.max(minimumHeight, Math.min(preferredHeight, availableSpace - gap)),
    })
  }, [])

  React.useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  React.useEffect(() => {
    if (!open) {
      return
    }

    updateDropdownPosition()
    window.addEventListener("resize", updateDropdownPosition)
    window.addEventListener("scroll", updateDropdownPosition, true)

    return () => {
      window.removeEventListener("resize", updateDropdownPosition)
      window.removeEventListener("scroll", updateDropdownPosition, true)
    }
  }, [open, updateDropdownPosition])

  function chooseOption(nextValue: string) {
    setValue(nextValue)
    setOpen(false)
    onValueChange?.(nextValue)
  }

  return (
    <span ref={rootRef} className="relative block">
      <input name={name} value={value} type="hidden" data-required={required ? "true" : undefined} readOnly />
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          updateDropdownPosition()
          setOpen((current) => !current)
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
          }

          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            updateDropdownPosition()
            setOpen(true)
          }
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-primary/10 bg-white px-3 text-left text-sm font-semibold text-foreground shadow-[0_8px_18px_-18px_rgba(33,33,156,0.45)] outline-none transition hover:border-primary/18 hover:bg-white/96 focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:pointer-events-none disabled:bg-muted disabled:opacity-70 data-[placeholder=true]:text-muted-foreground/70",
          className,
        )}
        data-placeholder={!selected}
      >
        <span className="min-w-0 truncate">{selected?.label ?? placeholder}</span>
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/8 text-accent">
          <ChevronDown className={cn("size-4 transition", open && "rotate-180")} aria-hidden="true" />
        </span>
      </button>

      {open && (
        <span
          id={id}
          role="listbox"
          style={{ maxHeight: dropdownStyle.maxHeight }}
          className={cn(
            "absolute left-0 right-0 z-30 overflow-y-auto overscroll-contain rounded-lg border border-white/85 bg-white/98 p-1.5 text-sm shadow-[0_22px_55px_-32px_rgba(33,33,156,0.9)] ring-1 ring-primary/8 backdrop-blur-xl",
            dropdownStyle.placement === "bottom" ? "top-[calc(100%+0.35rem)]" : "bottom-[calc(100%+0.35rem)]",
          )}
        >
          {options.map((option) => {
            const active = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onPointerDown={(event) => {
                  event.preventDefault()
                  chooseOption(option.value)
                }}
                onClick={() => chooseOption(option.value)}
                className={cn(
                  "flex min-h-9 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-xs font-extrabold text-primary transition hover:bg-primary/6",
                  active && "bg-accent/8 text-accent",
                )}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {active && <Check className="size-4 shrink-0" aria-hidden="true" />}
              </button>
            )
          })}
        </span>
      )}
    </span>
  )
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-lg border border-primary/10 bg-white px-3 py-2 text-sm font-semibold leading-relaxed text-foreground shadow-[0_8px_18px_-18px_rgba(33,33,156,0.45)] outline-none transition placeholder:text-muted-foreground/70 hover:border-primary/18 focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:pointer-events-none disabled:bg-muted disabled:opacity-70",
        className,
      )}
      {...props}
    />
  )
}

export function CheckboxCard({
  label,
  description,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  label: string
  description?: string
}) {
  return (
    <label
      className={cn(
        "group flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-primary/5 px-2.5 py-2 text-left text-[11px] font-bold leading-snug text-primary ring-1 ring-primary/6 transition hover:bg-white hover:ring-accent/20 has-checked:bg-accent/8 has-checked:text-accent has-checked:ring-accent/20",
        className,
      )}
    >
      <span className="relative grid size-4 shrink-0 place-items-center rounded-[0.3rem] border border-primary/20 bg-white transition group-has-checked:border-accent group-has-checked:bg-accent">
        <input type="checkbox" className="peer sr-only" {...props} />
        <Check className="size-3 text-white opacity-0 transition peer-checked:opacity-100" aria-hidden="true" />
      </span>
      <span className="flex min-h-4 min-w-0 flex-col justify-center">
        <span className="block">{label}</span>
        {description && <span className="mt-0.5 block text-[10.5px] font-semibold text-muted-foreground">{description}</span>}
      </span>
    </label>
  )
}

export function CheckboxGrid({
  legend,
  children,
  className,
}: {
  legend: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <fieldset className={cn("grid gap-2", className)}>
      <legend className="text-xs font-bold text-primary mb-1.5  ">{legend}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{children}</div>
    </fieldset>
  )
}

export function FormPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[1.1rem] bg-white/92 p-4 shadow-[0_18px_45px_-32px_rgba(33,33,156,0.75)] ring-1 ring-white/90 backdrop-blur sm:p-5",
        className,
      )}
      {...props}
    />
  )
}

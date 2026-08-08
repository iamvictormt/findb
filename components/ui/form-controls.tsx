"use client"

import { Check, ChevronDown } from "lucide-react"
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
    <label className={cn("grid gap-1.5 text-xs font-bold text-primary", className)}>
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
}: {
  name: string
  options: SelectOption[]
  placeholder?: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
  className?: string
}) {
  const id = React.useId()
  const rootRef = React.useRef<HTMLSpanElement>(null)
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  const selected = options.find((option) => option.value === value)

  React.useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  function chooseOption(nextValue: string) {
    setValue(nextValue)
    setOpen(false)
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
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
          }

          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault()
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
          className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 max-h-64 overflow-y-auto rounded-lg border border-white/85 bg-white/98 p-1.5 text-sm shadow-[0_22px_55px_-32px_rgba(33,33,156,0.9)] ring-1 ring-primary/8 backdrop-blur-xl"
        >
          {options.map((option) => {
            const active = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
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
      <legend className="text-xs font-bold text-primary">{legend}</legend>
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

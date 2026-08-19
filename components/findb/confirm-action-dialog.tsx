"use client"

import { useState, type ReactNode } from "react"
import { X } from "lucide-react"
import { FullscreenDialog } from "@/components/findb/fullscreen-dialog"

export function ConfirmActionDialog({
  id,
  action,
  trigger,
  icon,
  title,
  subject,
  description,
  closeLabel,
  cancelLabel,
  confirmLabel,
  triggerClassName = "inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary/5 px-4 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent",
  confirmClassName = "inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-accent",
}: {
  id: string
  action: () => Promise<void>
  trigger: string
  icon: ReactNode
  title: string
  subject: string
  description: string
  closeLabel: string
  cancelLabel: string
  confirmLabel: string
  triggerClassName?: string
  confirmClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const titleId = `confirm-action-${id}`

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        {icon}
        {trigger}
      </button>

      {open && (
        <FullscreenDialog labelledBy={titleId}>
          <div className="w-full rounded-[1.2rem] bg-white/96 p-4 shadow-[0_28px_70px_-34px_rgba(33,33,156,0.88)] ring-1 ring-white/90 backdrop-blur-xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                  {title}
                </p>
                <h3 id={titleId} className="mt-1 font-display text-xl font-extrabold leading-tight text-primary">
                  {subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/5 text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
                aria-label={closeLabel}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 rounded-lg bg-primary/5 p-3 text-xs font-semibold leading-relaxed text-muted-foreground ring-1 ring-primary/6">
              {description}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-primary/5 px-4 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
              >
                {cancelLabel}
              </button>
              <form action={action}>
                <button className={confirmClassName}>
                  {icon}
                  {confirmLabel}
                </button>
              </form>
            </div>
          </div>
        </FullscreenDialog>
      )}
    </>
  )
}

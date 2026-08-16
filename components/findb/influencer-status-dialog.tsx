"use client"

import { useState } from "react"
import { CheckCircle2, Clock3, ShieldAlert, SlidersHorizontal, X, XCircle } from "lucide-react"
import { updateInfluencerStatus } from "@/app/admin/influenciadores/actions"
import { FullscreenDialog } from "@/components/findb/fullscreen-dialog"

type InfluencerStatus = "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING"

const statusOptions: Array<{
  status: InfluencerStatus
  icon: typeof CheckCircle2
}> = [
  {
    status: "APPROVED",
    icon: CheckCircle2,
  },
  {
    status: "REJECTED",
    icon: XCircle,
  },
  {
    status: "SUSPENDED",
    icon: ShieldAlert,
  },
  {
    status: "PENDING",
    icon: Clock3,
  },
]

export function InfluencerStatusDialog({
  id,
  name,
  currentStatus,
  labels,
}: {
  id: string
  name: string
  currentStatus: string
  labels: {
    trigger: string
    title: string
    close: string
    current: string
    options: Record<InfluencerStatus, { label: string; description: string }>
  }
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-accent"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        {labels.trigger}
      </button>

      {open && (
        <FullscreenDialog labelledBy={`status-dialog-${id}`}>
          <div className="w-full rounded-[1.2rem] bg-white/96 p-4 shadow-[0_28px_70px_-34px_rgba(33,33,156,0.88)] ring-1 ring-white/90 backdrop-blur-xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                  {labels.title}
                </p>
                <h3 id={`status-dialog-${id}`} className="mt-1 font-display text-xl font-extrabold leading-tight text-primary">
                  {name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/5 text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
                aria-label={labels.close}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {statusOptions.map((option) => {
                const Icon = option.icon
                const isCurrent = option.status === currentStatus
                const action = updateInfluencerStatus.bind(null, id, option.status)
                const optionLabels = labels.options[option.status]

                return (
                  <form key={option.status} action={action}>
                    <button
                      disabled={isCurrent}
                      className="flex min-h-14 w-full items-center gap-3 rounded-lg bg-primary/5 px-3 py-2 text-left ring-1 ring-primary/6 transition hover:bg-white hover:ring-accent/20 disabled:pointer-events-none disabled:opacity-55"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-accent shadow-[0_8px_18px_-16px_rgba(33,33,156,0.6)]">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-extrabold text-primary">
                          {optionLabels.label}
                          {isCurrent ? ` ${labels.current}` : ""}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-semibold leading-relaxed text-muted-foreground">
                          {optionLabels.description}
                        </span>
                      </span>
                    </button>
                  </form>
                )
              })}
            </div>
          </div>
        </FullscreenDialog>
      )}
    </>
  )
}

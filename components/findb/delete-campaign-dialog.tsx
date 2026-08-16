"use client"

import { useState } from "react"
import { Trash2, X } from "lucide-react"
import { deleteCampaign } from "@/app/admin/campanhas/actions"
import { FullscreenDialog } from "@/components/findb/fullscreen-dialog"

export function DeleteCampaignDialog({
  id,
  title,
  labels,
}: {
  id: string
  title: string
  labels: {
    trigger: string
    title: string
    description: string
    close: string
    cancel: string
    confirm: string
  }
}) {
  const [open, setOpen] = useState(false)
  const titleId = `delete-campaign-${id}`

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary/5 px-4 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        {labels.trigger}
      </button>

      {open && (
        <FullscreenDialog labelledBy={titleId}>
          <div className="w-full rounded-[1.2rem] bg-white/96 p-4 shadow-[0_28px_70px_-34px_rgba(33,33,156,0.88)] ring-1 ring-white/90 backdrop-blur-xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                  {labels.title}
                </p>
                <h3 id={titleId} className="mt-1 font-display text-xl font-extrabold leading-tight text-primary">
                  {title}
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

            <p className="mt-4 rounded-lg bg-primary/5 p-3 text-xs font-semibold leading-relaxed text-muted-foreground ring-1 ring-primary/6">
              {labels.description}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-primary/5 px-4 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
              >
                {labels.cancel}
              </button>
              <form action={deleteCampaign.bind(null, id)}>
                <button className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-accent">
                  <Trash2 className="size-4" aria-hidden="true" />
                  {labels.confirm}
                </button>
              </form>
            </div>
          </div>
        </FullscreenDialog>
      )}
    </>
  )
}

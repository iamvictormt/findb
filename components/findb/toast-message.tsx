"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, X, XCircle } from "lucide-react"
import { translateFeedback, useI18n } from "@/lib/i18n"
import type { ToastType } from "@/lib/toast"

export function ToastMessage({
  type,
  message,
}: {
  type?: ToastType
  message?: string
}) {
  const [visible, setVisible] = useState(Boolean(message))
  const { t } = useI18n()
  const translatedMessage = translateFeedback(t, message)

  useEffect(() => {
    setVisible(Boolean(message))

    if (!message) {
      return
    }

    const timeout = window.setTimeout(() => setVisible(false), 5200)
    return () => window.clearTimeout(timeout)
  }, [message])

  if (!message || !type || !visible) {
    return null
  }

  const Icon = type === "success" ? CheckCircle2 : XCircle

  return (
    <div className="fixed inset-x-3 top-4 z-[10000] mx-auto max-w-[420px]" role="status" aria-live="polite">
      <div className="flex items-start gap-3 rounded-[1rem] bg-white/96 p-3 shadow-[0_22px_55px_-32px_rgba(33,33,156,0.9)] ring-1 ring-white/90 backdrop-blur-xl">
        <span className={type === "success" ? "grid size-9 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600" : "grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent"}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <p className="min-w-0 flex-1 pt-1 text-xs font-extrabold leading-relaxed text-primary">
          {translatedMessage}
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/5 text-primary ring-1 ring-primary/8 transition hover:bg-white hover:text-accent"
          aria-label={t.header.closeMenu}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

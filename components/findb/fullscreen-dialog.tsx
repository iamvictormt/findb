"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export function FullscreenDialog({
  children,
  labelledBy,
}: {
  children: React.ReactNode
  labelledBy?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex min-h-dvh w-screen items-stretch justify-center overflow-y-auto bg-primary/36 p-3 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className="flex min-h-[calc(100dvh-1.5rem)] w-full max-w-[520px] flex-col justify-center sm:min-h-0">
        {children}
      </div>
    </div>,
    document.body,
  )
}

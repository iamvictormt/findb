"use client"

import { LanguageSwitcher } from "@/components/findb/language-switcher"

export function AuthenticatedTopBar({
  left,
  right,
}: {
  left: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="relative z-[110] flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
      <div className="min-w-0">{left}</div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <LanguageSwitcher align="right" />
        {right}
      </div>
    </div>
  )
}

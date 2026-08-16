"use client"

import Link from "next/link"
import { LogIn } from "lucide-react"
import { LanguageSwitcher } from "@/components/findb/language-switcher"
import { useI18n } from "@/lib/i18n"

export function HomeTopBar() {
  const { t } = useI18n()

  return (
    <div className="absolute left-1/2 top-4 z-30 w-full max-w-[640px] -translate-x-1/2 px-3.5 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
      <div className="flex items-center justify-between gap-3">
        <LanguageSwitcher />
        <Link
          href="/influenciadores/entrar"
          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-white/75 bg-white/70 px-3 text-sm font-bold text-primary shadow-sm backdrop-blur transition hover:bg-white hover:text-accent"
        >
          <LogIn className="size-4" aria-hidden="true" />
          {t.header.login}
        </Link>
      </div>
    </div>
  )
}

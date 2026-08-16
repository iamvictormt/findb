"use client"

import { ChevronDown, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { languages, useI18n, type Lang } from "@/lib/i18n"

export function LanguageSwitcher({ align = "left" }: { align?: "left" | "right" }) {
  const [open, setOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { lang, setLang, t } = useI18n()

  useEffect(() => {
    if (!open) {
      return
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [open])

  function chooseLanguage(nextLang: Lang) {
    setLang(nextLang)
    setOpen(false)
    router.refresh()
  }

  return (
      <div ref={switcherRef} className="relative z-[120] w-fit">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={t.header.language}
          className="flex items-center gap-1.5 rounded-full border border-white/75 bg-white/70 px-3 py-1.5 text-sm font-bold text-primary shadow-sm backdrop-blur transition hover:bg-white"
        >
          <Globe className="size-4 text-primary" aria-hidden="true" />
          {languages.find((item) => item.code === lang)?.label ?? "BR"}
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className={`absolute top-11 z-[130] w-52 overflow-hidden rounded-2xl border border-white/75 bg-white/96 p-1.5 shadow-[0_26px_70px_-34px_rgba(33,33,156,0.92)] backdrop-blur-xl ${align === "right" ? "right-0" : "left-0"}`}>
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => chooseLanguage(item.code)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold transition hover:bg-primary/7 ${
                  item.code === lang ? "text-accent" : "text-primary"
                }`}
              >
                <span className="min-w-0 truncate">{item.name}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
  )
}

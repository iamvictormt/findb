"use client"

import { ChevronDown, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { languages, useI18n, type Lang } from "@/lib/i18n"

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)
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
  }

  return (
    <div className="absolute left-1/2 top-4 z-30 w-full max-w-[640px] -translate-x-1/2 px-3.5 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
      <div ref={switcherRef} className="relative ml-auto w-fit">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={t.header.language}
          className="flex items-center gap-1.5 rounded-full border border-white/75 bg-white/70 px-3 py-1.5 text-sm font-bold text-primary shadow-sm backdrop-blur transition hover:bg-white"
        >
          <Globe className="size-4 text-primary" aria-hidden="true" />
          {languages.find((item) => item.code === lang)?.label ?? "PT"}
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="absolute right-0 top-11 w-36 overflow-hidden rounded-2xl border border-white/75 bg-white/94 p-1.5 shadow-xl backdrop-blur-xl">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => chooseLanguage(item.code)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition hover:bg-primary/7 ${
                  item.code === lang ? "text-accent" : "text-primary"
                }`}
              >
                <span>{item.name}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

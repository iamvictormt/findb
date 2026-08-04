"use client"

import { useState } from "react"
import { ChevronDown, Globe, Menu, X } from "lucide-react"
import { linkTags } from "@/lib/findb-data"
import { languages, useI18n, type Lang } from "@/lib/i18n"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLang, t } = useI18n()

  function chooseLanguage(nextLang: Lang) {
    setLang(nextLang)
    setLangOpen(false)
  }

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[640px] items-center justify-end gap-3 px-4 py-4 sm:px-6 lg:max-w-[720px]">
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((value) => !value)}
            aria-expanded={langOpen}
            aria-label={t.header.language}
            className="flex items-center gap-1.5 rounded-full border border-white/75 bg-white/65 px-3 py-1.5 text-sm font-bold text-primary shadow-sm backdrop-blur transition hover:bg-white"
          >
            <Globe className="size-4 text-primary" aria-hidden="true" />
            {languages.find((item) => item.code === lang)?.label ?? "PT"}
            <ChevronDown
              className={`size-3.5 text-muted-foreground transition ${langOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-11 w-36 overflow-hidden rounded-2xl border border-white/75 bg-white/92 p-1.5 shadow-xl backdrop-blur-xl">
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

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? t.header.closeMenu : t.header.openMenu}
          className="grid size-10 place-items-center rounded-full border border-white/75 bg-white/65 text-primary shadow-sm backdrop-blur transition hover:text-accent"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="mx-auto max-w-[640px] px-4 sm:px-6 lg:max-w-[720px]">
          <ul className="overflow-hidden rounded-[1.35rem] border border-white/75 bg-white/90 p-2 shadow-xl backdrop-blur-xl">
            {linkTags.map((tag) => {
              const copy = t.links[tag.id as keyof typeof t.links]

              return (
                <li key={tag.id}>
                  <a
                    href={tag.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-primary/7"
                  >
                    <tag.icon className="size-4 text-accent" aria-hidden="true" />
                    {copy?.[0] ?? tag.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}

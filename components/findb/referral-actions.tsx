"use client"

import { useState } from "react"
import { Copy, Megaphone } from "lucide-react"

export function ReferralActions({ referralUrl, eventUrl }: { referralUrl: string; eventUrl: string }) {
  const [copied, setCopied] = useState(false)

  async function registerShare() {
    await fetch(eventUrl, { method: "POST" }).catch(() => null)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function shareLink() {
    await registerShare()

    if (navigator.share) {
      await navigator.share({
        title: "FindB Europa",
        text: "Conheca a FindB Europa e encontre oportunidades para imigrantes.",
        url: referralUrl,
      })
      return
    }

    await copyLink()
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-white shadow-[0_12px_24px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent"
      >
        <Copy className="size-4" aria-hidden="true" />
        {copied ? "Link copiado" : "Copiar link"}
      </button>
      <button
        type="button"
        onClick={shareLink}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs font-extrabold text-accent ring-1 ring-accent/10 transition hover:bg-accent hover:text-white"
      >
        <Megaphone className="size-4" aria-hidden="true" />
        Compartilhar
      </button>
    </div>
  )
}

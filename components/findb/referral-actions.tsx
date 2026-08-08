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
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-extrabold text-white transition hover:bg-accent"
      >
        <Copy className="size-4" aria-hidden="true" />
        {copied ? "Link copiado" : "Copiar link"}
      </button>
      <button
        type="button"
        onClick={shareLink}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-xs font-extrabold text-accent transition hover:bg-accent hover:text-white"
      >
        <Megaphone className="size-4" aria-hidden="true" />
        Compartilhar
      </button>
    </div>
  )
}

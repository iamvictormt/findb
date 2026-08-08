"use client"

import { ExternalLink, Heart, Lock } from "lucide-react"
import { socials, siteUrl } from "@/lib/findb-data"
import { useI18n } from "@/lib/i18n"

const socialTone: Record<string, string> = {
  instagram:
    "text-accent ring-accent/25 [--social-hover:#D9385F] [--social-shadow:rgba(217,56,95,0.42)]",
  facebook:
    "text-[#2563eb] ring-blue-500/25 [--social-hover:#2563eb] [--social-shadow:rgba(37,99,235,0.38)]",
  youtube:
    "text-[#ff2f6d] ring-rose-500/25 [--social-hover:#ff2f6d] [--social-shadow:rgba(255,47,109,0.4)]",
  whatsapp:
    "text-emerald-500 ring-emerald-400/25 [--social-hover:#22c55e] [--social-shadow:rgba(34,197,94,0.38)]",
  telegram:
    "text-sky-500 ring-sky-400/25 [--social-hover:#0ea5e9] [--social-shadow:rgba(14,165,233,0.38)]",
}

function SocialIcon({ id }: { id: string }) {
  const common = { className: "size-4.5", "aria-hidden": true, fill: "currentColor" }

  switch (id) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.9.04-1.38.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71C3.21 8.5 3.2 8.86 3.2 12s.01 3.5.07 4.74c.04.9.19 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.33-.13-.81-.28-1.71-.32C15.5 4.01 15.14 4 12 4Zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.15-2.99a1.16 1.16 0 1 1 0 2.32 1.16 1.16 0 0 1 0-2.32Z" />
        </svg>
      )
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.25c-1.24 0-1.63.77-1.63 1.56v1.9h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
        </svg>
      )
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M23.5 6.54a3.02 3.02 0 0 0-2.13-2.14C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.37.5A3.02 3.02 0 0 0 .5 6.54C0 8.42 0 12.34 0 12.34s0 3.92.5 5.8a3.02 3.02 0 0 0 2.13 2.14c1.87.5 9.37.5 9.37.5s7.5 0 9.37-.5a3.02 3.02 0 0 0 2.13-2.14c.5-1.88.5-5.8.5-5.8s0-3.92-.5-5.8ZM9.6 15.9V8.78l6.27 3.56L9.6 15.9Z" />
        </svg>
      )
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12.04 2a9.9 9.9 0 0 0-9.96 9.86c0 1.74.46 3.44 1.33 4.94L2 22l5.31-1.38a10.05 10.05 0 0 0 4.73 1.2h.01A9.9 9.9 0 0 0 22 11.96 9.91 9.91 0 0 0 12.04 2Zm5.86 14.15c-.24.67-1.38 1.28-1.93 1.36-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.24-4.79-4.13-4.94-4.32-.14-.19-1.18-1.56-1.18-2.98s.75-2.12 1.01-2.41c.26-.29.57-.36.76-.36h.55c.17 0 .42-.07.64.49.24.57.81 1.99.88 2.13.07.15.12.31.02.5-.1.2-.14.31-.28.48-.15.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.29.74 1.21 1.59 1.96 1.1.97 2.02 1.27 2.31 1.42.29.14.46.12.63-.07.17-.2.72-.84.91-1.13.19-.29.38-.24.65-.15.26.1 1.67.79 1.96.93.29.15.48.22.55.34.07.12.07.7-.17 1.38Z" />
        </svg>
      )
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M21.93 4.64 18.9 18.93c-.23 1.01-.82 1.26-1.67.78l-4.63-3.41-2.23 2.15c-.25.25-.45.45-.93.45l.33-4.71 8.57-7.74c.37-.33-.08-.52-.58-.19L7.16 12.98 2.58 11.55c-1-.31-1.02-.99.21-1.47l17.9-6.9c.83-.3 1.55.2 1.24 1.46Z" />
        </svg>
      )
    default:
      return <ExternalLink className="size-4.5" aria-hidden="true" />
  }
}

export function SocialFooter() {
  const { t } = useI18n()

  return (
    <footer className="rounded-[1.2rem] bg-white/78 px-3 py-3 text-center shadow-[0_12px_34px_-25px_rgba(33,33,156,0.55)] ring-1 ring-white/80 backdrop-blur transition duration-300 hover:bg-white/84 hover:shadow-[0_18px_44px_-30px_rgba(33,33,156,0.72)] min-[390px]:px-4 sm:px-5">
      <div className="grid items-center gap-3 min-[460px]:grid-cols-[112px_1fr_126px] md:grid-cols-[132px_1fr_142px]">
        <p className="text-center text-[11px] font-semibold leading-tight text-primary min-[460px]:text-left sm:text-[12px] md:text-[13px]">
          {t.footer.follow}
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`findb-social-link grid size-8 place-items-center rounded-full bg-white shadow-sm ring-1 transition sm:size-9 md:size-10 ${
                  socialTone[social.id] ??
                  "text-primary ring-primary/20 [--social-hover:var(--brand-navy)] [--social-shadow:rgba(33,33,156,0.36)]"
                }`}
              >
                <SocialIcon id={social.id} />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center justify-self-center min-[460px]:items-start min-[460px]:justify-self-end">
          <span className="mb-1 text-[9.5px] font-extrabold leading-none text-muted-foreground md:text-[10px]">
            {t.footer.learnMore}
          </span>
          <a
            href={siteUrl.href}
            target="_blank"
            rel="noopener noreferrer"
            title={siteUrl.label}
            className="findb-site-button inline-flex w-[118px] items-center justify-between gap-1 rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[10.5px] font-extrabold text-primary shadow-sm transition md:w-[132px] md:text-[11px]"
          >
            <span className="truncate">{t.footer.site}</span>
            <ExternalLink className="size-3 shrink-0 transition-transform duration-300" aria-hidden="true" />
          </a>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] font-semibold text-primary sm:text-[12px] md:text-[13px]">
        <Lock className="mr-1.5 inline size-3.5 align-[-0.16em] text-primary" aria-hidden="true" />
        <span>{t.footer.connected} </span>
        <span className="font-bold text-accent">{t.footer.stories}</span>
        <Heart className="ml-1.5 inline size-3.5 fill-accent align-[-0.16em] text-accent" aria-hidden="true" />
      </p>
    </footer>
  )
}

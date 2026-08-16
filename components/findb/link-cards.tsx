"use client"

import {
  BadgeEuro,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Globe2,
  Handshake,
  MessageCircle,
  Network,
  Plane,
  UsersRound,
  type LucideIcon,
} from "lucide-react"
import type { HomeLinkView } from "@/lib/home-links"
import { useI18n, type Lang } from "@/lib/i18n"

const toneStyles: Record<HomeLinkView["tone"], { icon: string; arrow: string; arrowBg: string }> = {
  blue: {
    icon: "bg-blue-500/10 text-blue-600",
    arrow: "text-blue-600",
    arrowBg: "bg-blue-500/8",
  },
  pink: {
    icon: "bg-accent/10 text-accent",
    arrow: "text-accent",
    arrowBg: "bg-accent/8",
  },
  cyan: {
    icon: "bg-violet-500/10 text-violet-600",
    arrow: "text-violet-600",
    arrowBg: "bg-violet-500/8",
  },
  green: {
    icon: "bg-emerald-500/12 text-emerald-600",
    arrow: "text-emerald-600",
    arrowBg: "bg-emerald-500/8",
  },
  gold: {
    icon: "bg-accent/10 text-accent",
    arrow: "text-accent",
    arrowBg: "bg-accent/8",
  },
}

const icons: Record<string, LucideIcon> = {
  BadgeEuro,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Globe2,
  Handshake,
  MessageCircle,
  Network,
  Plane,
  UsersRound,
}

export function LinkCards({ links }: { links: HomeLinkView[] }) {
  const { lang } = useI18n()

  return (
    <ul className="flex flex-col gap-2.5">
      {links.map((tag) => {
        const tone = toneStyles[tag.tone]
        const isExternal = tag.href.startsWith("http")
        const Icon = icons[tag.icon] ?? ChevronRight
        const copy = getLocalizedCopy(tag, lang)

        return (
          <li key={tag.id}>
            <a
              href={tag.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="findb-link-card group relative flex min-h-[60px] items-center gap-3 overflow-hidden rounded-[1.15rem] bg-white/88 px-3 py-2.5 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_38px_-24px_rgba(33,33,156,0.78)] hover:ring-white/90 min-[390px]:min-h-[62px] min-[390px]:gap-3.5 min-[390px]:rounded-[1.2rem] min-[390px]:px-4 sm:min-h-[70px] sm:gap-4 sm:px-5 sm:py-3"
            >
              <span aria-hidden="true" className="findb-link-shine" />
              <span className={`findb-link-icon grid size-11 shrink-0 place-items-center rounded-full min-[390px]:size-12 sm:size-[52px] ${tone.icon}`}>
                <Icon className="size-[22px] transition-transform duration-300 group-hover:scale-110 min-[390px]:size-6 sm:size-[26px]" aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1 text-left">
                <span className="block font-display text-[14px] font-semibold leading-snug text-primary text-pretty min-[390px]:text-[15px] sm:text-base">
                  {copy.title}
                </span>
                <span className="block text-[11.5px] font-semibold leading-snug text-muted-foreground text-pretty min-[390px]:text-[12.5px] sm:text-[13.5px]">
                  {copy.subtitle}
                </span>
              </span>

              <span
                className={`findb-link-arrow grid size-7 shrink-0 place-items-center rounded-full transition-transform min-[390px]:size-8 sm:size-9 ${tone.arrowBg} ${tone.arrow}`}
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function getLocalizedCopy(tag: HomeLinkView, lang: Lang) {
  if (lang === "ptPt") {
    return {
      title: tag.titlePtPt || tag.title,
      subtitle: tag.subtitlePtPt || tag.subtitle,
    }
  }

  if (lang === "en") {
    return {
      title: tag.titleEn || tag.title,
      subtitle: tag.subtitleEn || tag.subtitle,
    }
  }

  if (lang === "es") {
    return {
      title: tag.titleEs || tag.title,
      subtitle: tag.subtitleEs || tag.subtitle,
    }
  }

  if (lang === "fr") {
    return {
      title: tag.titleFr || tag.title,
      subtitle: tag.subtitleFr || tag.subtitle,
    }
  }

  return {
    title: tag.title,
    subtitle: tag.subtitle,
  }
}

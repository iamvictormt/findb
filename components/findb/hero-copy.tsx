"use client"

import { Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function HeroCopy() {
  const { t } = useI18n()

  return (
    <>
      <p className="relative z-10 mt-2 max-w-[22rem] px-2 text-[14px] leading-relaxed text-primary min-[390px]:text-[15px] sm:text-base">
        {t.hero.community}
        <span className="block font-display text-[17px] font-semibold leading-tight text-accent min-[390px]:text-lg sm:text-xl">
          {t.hero.join}
        </span>
      </p>
      <Heart className="relative z-10 mt-2 size-5 fill-accent text-accent" aria-hidden="true" />

      <p className="relative z-10 mt-2 px-2 text-[13px] font-normal italic text-muted-foreground min-[390px]:text-sm sm:text-[15px]">
        {t.hero.tagline}
      </p>
    </>
  )
}

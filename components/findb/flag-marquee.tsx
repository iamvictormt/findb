"use client"

import { useEffect, useState } from "react"
import { countries, countryFlagPreview } from "@/lib/findb-data"
import { useI18n } from "@/lib/i18n"

const DOTS = 9
const STEP_MS = 62000 / DOTS

function getOrderedCountries() {
  const preview = countryFlagPreview
    .map((code) => countries.find((country) => country.code === code))
    .filter(Boolean)
  const rest = countries.filter((country) => !countryFlagPreview.includes(country.code))

  return [...preview, ...rest]
}

function FlagTrack() {
  const orderedCountries = getOrderedCountries()

  return (
    <div className="flag-infinite-track flex w-max shrink-0 items-center gap-2 pr-2 min-[390px]:gap-2.5 min-[390px]:pr-2.5">
      {orderedCountries.map((country) => (
        <img
          key={country!.code}
          src={`https://flagcdn.com/w80/${country!.code}.png`}
          srcSet={`https://flagcdn.com/w160/${country!.code}.png 2x`}
          alt={`Bandeira de ${country!.name}`}
          title={country!.name}
          width={34}
          height={24}
          loading="lazy"
          className="findb-flag h-[22px] w-8 shrink-0 rounded-[0.32rem] object-cover shadow-[0_6px_12px_-8px_rgba(36,31,111,0.85)] ring-1 ring-black/5 min-[390px]:h-6 min-[390px]:w-[34px] sm:h-7 sm:w-10 md:h-8 md:w-11"
        />
      ))}
    </div>
  )
}

export function FlagMarquee() {
  const [activeDot, setActiveDot] = useState(0)
  const [paused, setPaused] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    if (paused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveDot((current) => (current + 1) % DOTS)
    }, STEP_MS)

    return () => window.clearInterval(timer)
  }, [paused])

  return (
    <section id="bandeiras" aria-label="Países europeus" className="scroll-mt-8 pt-1">
      <p className="mb-2.5 text-center font-display text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary min-[390px]:text-[11px] min-[390px]:tracking-[0.34em] sm:text-xs">
        {t.flags.title} <span className="text-accent">{t.flags.accent}</span>
      </p>

      <div className="relative pb-5">
        <div
          className={`marquee-mask flag-infinite flex overflow-hidden py-1 ${paused ? "is-paused" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <FlagTrack />
          <FlagTrack />
        </div>

        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {Array.from({ length: DOTS }, (_, index) => (
            <span
              key={index}
              className={`size-1.5 rounded-full transition duration-300 ${
                index <= activeDot ? "bg-accent shadow-[0_0_8px_rgba(231,25,115,0.35)]" : "bg-primary/16"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { stats } from "@/lib/findb-data"
import { useI18n } from "@/lib/i18n"

export function StatsRow() {
  const { t } = useI18n()

  return (
    <section aria-label="Destaques FindB" className="rounded-[1.3rem] bg-white/90 p-2.5 shadow-[0_14px_32px_-24px_rgba(36,31,111,0.5)] ring-1 ring-white/80 backdrop-blur sm:p-3">
      <ul className="grid grid-cols-3 gap-1 min-[430px]:grid-cols-6 min-[430px]:divide-x min-[430px]:divide-primary/8">
        {stats.map((stat) => {
          const copy = t.stats[stat.id as keyof typeof t.stats]

          return (
            <li
              key={stat.id}
              className="group flex min-h-[74px] flex-col items-center justify-start gap-1 rounded-xl px-1 py-2 text-center transition duration-300 hover:bg-white/62 min-[430px]:min-h-[80px] sm:min-h-[92px] sm:gap-1.5"
            >
              <span className="findb-stat-icon grid size-8 place-items-center rounded-full text-blue-500 transition group-even:text-accent sm:size-10">
                <stat.icon className="size-5 transition-transform duration-300 group-hover:scale-110 sm:size-6" aria-hidden="true" />
              </span>
              <span className="font-display text-[10.5px] font-bold leading-tight text-primary min-[430px]:text-[11px] sm:text-[12px]">
                {copy?.[0] ?? stat.value}
              </span>
              <span className="max-w-18 text-[9.5px] font-bold leading-tight text-primary/85 text-balance min-[430px]:max-w-16 min-[430px]:text-[10px] sm:max-w-20 sm:text-[11px]">
                {copy?.[1] ?? stat.label}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

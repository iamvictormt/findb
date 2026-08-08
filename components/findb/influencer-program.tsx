"use client"

import { BadgeEuro, ChevronRight, ExternalLink, Megaphone, ShieldCheck } from "lucide-react"

const highlights = [
  "Divulgue a bio da FindB Europa no seu perfil",
  "Marque a FindB Europa nas publicações",
  "Veja campanhas e regras oficiais na comunidade",
]

export function InfluencerProgram() {
  return (
    <section id="influenciadores" aria-labelledby="influenciadores-title" className="scroll-mt-6">
      <div className="px-1 text-center">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
          Programa oficial. <span className="text-accent">Ganhe em euros.</span>
        </p>
      </div>

      <div className="mt-2.5 rounded-[1.15rem] bg-white/90 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:p-5">
        <a
          href="/influenciadores"
          aria-label="Abrir comunidade FindB Europa para participar do programa Influenciadores Imigrantes"
          className="findb-link-card group relative flex min-h-[76px] items-center gap-3 overflow-hidden rounded-[1rem] bg-white/80 px-3 py-3 ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_38px_-24px_rgba(33,33,156,0.78)] min-[390px]:gap-3.5 min-[390px]:px-4 sm:min-h-[84px] sm:gap-4 sm:px-5"
        >
          <span aria-hidden="true" className="findb-link-shine" />
          <span className="findb-link-icon grid size-12 shrink-0 place-items-center rounded-full bg-gradient-brand text-white shadow-[0_12px_24px_-18px_rgba(33,33,156,0.9)] min-[390px]:size-[52px] sm:size-[56px]">
            <BadgeEuro className="size-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
          </span>

          <span className="min-w-0 flex-1 text-left">
            <span
              id="influenciadores-title"
              className="block font-display text-[15px] font-extrabold leading-tight text-primary text-pretty min-[390px]:text-[16px] sm:text-lg"
            >
              Influenciadores Imigrantes
            </span>
            <span className="mt-0.5 block text-[11.5px] font-semibold leading-snug text-muted-foreground text-pretty min-[390px]:text-[12.5px] sm:text-[13.5px]">
              Divulgue a FindB Europa, receba seu link exclusivo e acompanhe campanhas para ganhar em euros.
            </span>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/8 px-2.5 py-1 text-[10px] font-extrabold text-accent">
              Quero Ganhar em Euros
              <ExternalLink className="size-3" aria-hidden="true" />
            </span>
          </span>

          <span className="findb-link-arrow grid size-8 shrink-0 place-items-center rounded-full bg-accent/8 text-accent transition-transform sm:size-9">
            <ChevronRight className="size-5" aria-hidden="true" />
          </span>
        </a>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = index === 0 ? Megaphone : ShieldCheck

            return (
              <div
                key={item}
                className="flex items-center gap-2 rounded-[0.9rem] bg-primary/5 px-3 py-2 text-left text-[11px] font-bold leading-snug text-primary/82 ring-1 ring-primary/6"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-accent shadow-[0_8px_18px_-16px_rgba(33,33,156,0.6)]">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span>{item}</span>
              </div>
            )
          })}
        </div>

        <p className="mt-3 rounded-[0.9rem] bg-white/74 px-3 py-2.5 text-center text-[11px] font-semibold leading-relaxed text-primary/82 ring-1 ring-white/80 min-[390px]:px-4 sm:text-xs">
          A participação está sujeita à aprovação da FindB Europa, aos Termos de Uso e às regras de cada campanha.
        </p>
      </div>
    </section>
  )
}

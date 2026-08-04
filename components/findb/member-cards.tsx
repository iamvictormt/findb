import { Check, ContactRound } from "lucide-react"
import { memberCards, type MemberCard } from "@/lib/findb-data"

const variants: Record<MemberCard["variant"], string> = {
  connect: "from-[#241f6f] via-[#3730a3] to-[#0ea5e9]",
  plus: "from-[#e71973] via-[#c21777] to-[#4530a6]",
  founder: "from-[#111827] via-[#2c236d] to-[#d99930]",
}

export function MemberCards() {
  return (
    <section id="cartoes" aria-labelledby="cartoes-title" className="scroll-mt-8">
      <div className="mb-3 flex items-end justify-between px-1">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            Membros
          </p>
          <h2
            id="cartoes-title"
            className="font-display text-xl font-extrabold tracking-normal text-primary"
          >
            Cartões FindB
          </h2>
        </div>
        <p className="max-w-28 text-right text-[11px] font-semibold leading-tight text-muted-foreground">
          Arraste para ver planos
        </p>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {memberCards.map((card) => (
          <a
            key={card.id}
            href={card.href}
            className={`member-card group relative flex aspect-[1.58/1] w-[84%] max-w-[360px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[1.35rem] bg-gradient-to-br p-5 text-white shadow-[0_24px_60px_-32px_rgba(17,24,39,0.9)] ring-1 ring-white/20 transition duration-300 hover:-translate-y-1 ${variants[card.variant]}`}
          >
            <div aria-hidden="true" className="member-card-grid" />
            <div aria-hidden="true" className="member-card-light" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.26em] text-white/68">
                  FindB Europa
                </p>
                <p className="mt-1 font-display text-3xl font-extrabold tracking-normal">
                  {card.tier}
                </p>
              </div>
              <div className="grid size-11 place-items-center rounded-2xl bg-white/14 ring-1 ring-white/25 backdrop-blur">
                <ContactRound className="size-5" aria-hidden="true" />
              </div>
            </div>

            <div className="relative space-y-2">
              <ul className="grid gap-1">
                {card.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-1.5 text-[12px] font-semibold text-white/90">
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-white/18">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
              <p className="max-w-56 text-[11px] font-medium leading-snug text-white/70">
                {card.tagline}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

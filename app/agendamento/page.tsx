import Link from "next/link"
import { ArrowLeft, CalendarCheck2, Handshake, ShieldCheck } from "lucide-react"
import { createPartnershipMeeting } from "@/app/agendamento/actions"
import { BrandLogo } from "@/components/findb/brand-logo"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { PartnershipScheduler } from "@/components/findb/partnership-scheduler"
import { ToastMessage } from "@/components/findb/toast-message"
import { prisma } from "@/lib/prisma"
import { getToastFromSearchParams } from "@/lib/toast"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SchedulingPage({ searchParams }: PageProps) {
  const toast = await getToastFromSearchParams(searchParams)
  const slots = await prisma.meetingSlot.findMany({
    where: {
      isActive: true,
      startsAt: { gt: new Date() },
      booking: null,
    },
    orderBy: { startsAt: "asc" },
    take: 60,
  })

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <ToastMessage type={toast?.type} message={toast?.message} />
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          FindB Europa
        </Link>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-28 min-[390px]:size-32 sm:size-36" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            Parcerias e negócios
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">Agende sua conversa</span>{" "}
            <span className="text-accent">com a FindB Europa</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            Escolha apenas entre os dias e horários liberados pela equipe. O sistema confirma o agendamento somente quando o horário está disponível.
          </p>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-3 sm:p-5">
          <TrustPill icon={<CalendarCheck2 className="size-4" aria-hidden="true" />} title="Agendamento fácil" text="Em poucos passos voce escolhe data e hora." />
          <TrustPill icon={<ShieldCheck className="size-4" aria-hidden="true" />} title="Horários protegidos" text="Datas fora da agenda não são aceitas." />
          <TrustPill icon={<Handshake className="size-4" aria-hidden="true" />} title="Parcerias reais" text="Uma conversa para alinhar oportunidades." />
        </section>

        <PartnershipScheduler
          action={createPartnershipMeeting}
          slots={slots.map((slot) => ({
            id: slot.id,
            startsAt: slot.startsAt.toISOString(),
            endsAt: slot.endsAt.toISOString(),
          }))}
        />
      </div>
    </main>
  )
}

function TrustPill({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-[0.9rem] bg-primary/5 px-3 py-2 text-left ring-1 ring-primary/6">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-accent shadow-[0_8px_18px_-16px_rgba(33,33,156,0.6)]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-extrabold leading-tight text-primary">{title}</span>
        <span className="block text-[10.5px] font-semibold leading-snug text-muted-foreground">{text}</span>
      </span>
    </div>
  )
}

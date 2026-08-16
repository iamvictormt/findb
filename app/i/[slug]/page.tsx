import Link from "next/link"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { ArrowRight, AtSign, BadgeEuro, BriefcaseBusiness, Globe2, Home, UserStar, UsersRound } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { prisma } from "@/lib/prisma"
import { recordReferralEvent } from "@/lib/referral-events"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ReferralLandingPage({ params }: PageProps) {
  const { slug } = await params
  const cleanSlug = sanitizeSlug(slug)
  const profile = await prisma.influencerProfile.findUnique({
    where: { referralSlug: cleanSlug },
    select: {
      id: true,
      name: true,
      country: true,
      primaryNetwork: true,
      socialHandle: true,
      categories: true,
      languages: true,
      status: true,
      referralSlug: true,
    },
  })

  if (!profile || profile.status !== "APPROVED") {
    notFound()
  }

  await recordReferralEvent({
    influencerId: profile.id,
    type: "CLICK",
    source: "public-referral-page",
    headers: await headers(),
  })

  const benefits = [
    { icon: Home, title: "Moradia", description: "Encontre caminhos e contatos para viver melhor na Europa." },
    { icon: BriefcaseBusiness, title: "Empregos", description: "Acompanhe oportunidades e conexões para sua rotina." },
    { icon: UsersRound, title: "Comunidade", description: "Participe de uma rede feita para brasileiros e imigrantes." },
  ]

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-8 min-[390px]:px-4 sm:px-6 sm:pt-10 lg:max-w-[720px]">
        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-36 min-[390px]:size-40 sm:size-44" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            Convite FindB Europa
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2.15rem] font-semibold leading-none tracking-normal text-balance min-[390px]:text-[2.45rem] sm:text-5xl">
            <span className="text-primary">Sua vida na</span>{" "}
            <span className="text-accent">Europa</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            Você recebeu um convite de {profile.name} para conhecer conexões, oportunidades e conteúdos úteis para imigrantes.
          </p>
        </section>

        <section className="findb-link-card relative overflow-hidden rounded-[1.2rem] bg-white/90 p-4 text-left shadow-[0_18px_45px_-34px_rgba(33,33,156,0.72)] ring-1 ring-white/85 backdrop-blur sm:p-5">
          <span aria-hidden="true" className="findb-link-shine" />
          <span aria-hidden="true" className="absolute right-0 top-0 h-24 w-24 rounded-bl-[3rem] bg-gradient-to-br from-accent/12 to-blue-500/10" />

          <div className="relative z-10 grid gap-3">
            <div className="grid grid-cols-[auto_1fr] items-center gap-3">
              <span className="findb-link-icon grid size-12 shrink-0 place-items-center rounded-full bg-gradient-brand font-display text-base font-extrabold text-white shadow-[0_12px_24px_-18px_rgba(33,33,156,0.9)]">
                {profile.name.trim().charAt(0).toUpperCase() || "F"}
              </span>
              <div className="min-w-0">
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Indicação verificada
                </p>
                <h2 className="mt-1 break-words font-display text-xl font-extrabold leading-tight text-primary">
                  {profile.name}
                </h2>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <PublicInfo icon={Globe2} label="País" value={profile.country} tone="blue" />
              <PublicInfo icon={AtSign} label="Rede" value={profile.primaryNetwork} tone="pink" />
              <PublicInfo icon={UserStar} label="Perfil" value={profile.socialHandle} tone="blue" />
              <PublicInfo icon={BadgeEuro} label="Programa" value="Influenciadores FindB" tone="pink" />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <TextBlock label="Categorias" value={profile.categories} />
              <TextBlock label="Idiomas" value={profile.languages} />
            </div>
          </div>
        </section>

        <Link
          href={`/?ref=${profile.referralSlug}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent"
        >
          Entrar na FindB Europa
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-3 sm:p-5">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-[0.9rem] bg-primary/5 px-3 py-3 text-left ring-1 ring-primary/6">
              <benefit.icon className="size-5 text-accent" aria-hidden="true" />
              <h2 className="mt-2 font-display text-sm font-extrabold text-primary">{benefit.title}</h2>
              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}

function PublicInfo({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Globe2
  label: string
  value: string
  tone: "blue" | "pink"
}) {
  const iconTone = tone === "blue" ? "bg-blue-500/10 text-blue-600" : "bg-accent/10 text-accent"

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 rounded-[1rem] bg-white/64 p-2.5 ring-1 ring-primary/6">
      <span className={`grid size-8 shrink-0 place-items-center rounded-full ${iconTone}`}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className="mt-0.5 block break-words text-xs font-extrabold leading-relaxed text-primary">{value}</span>
      </span>
    </div>
  )
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-primary/5 p-3 ring-1 ring-primary/6">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-extrabold leading-relaxed text-primary">{value}</p>
    </div>
  )
}

function sanitizeSlug(slug: string) {
  return decodeURIComponent(slug).trim().replace(/[,.]+$/g, "")
}

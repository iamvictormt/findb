import Link from "next/link"
import { notFound } from "next/navigation"
import QRCode from "qrcode"
import { ArrowLeft, BadgeEuro, BarChart3, CheckCircle2, Download, Link2, Megaphone, Trophy } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { ReferralActions } from "@/components/findb/referral-actions"
import { prisma } from "@/lib/prisma"
import { formatEuro, makeReferralUrl } from "@/lib/influencer-program"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function InfluencerDashboardPage({ params }: PageProps) {
  const { slug } = await params
  const profile = await prisma.influencerProfile.findUnique({
    where: { referralSlug: slug },
    include: {
      earnings: { orderBy: { createdAt: "desc" }, take: 5, include: { campaign: true } },
      events: { orderBy: { createdAt: "desc" }, take: 20 },
      invites: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  })

  if (!profile) {
    notFound()
  }

  const [campaigns, assets] = await Promise.all([
    prisma.campaign.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.contentAsset.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ])
  const referralUrl = makeReferralUrl(profile.referralSlug)
  const qrSvg = await QRCode.toString(referralUrl, {
    type: "svg",
    margin: 1,
    color: {
      dark: "#21219c",
      light: "#ffffff",
    },
  })
  const clicks = profile.events.filter((event) => event.type === "CLICK").length
  const shares = profile.events.filter((event) => event.type === "SHARE").length
  const conversions = profile.events.filter((event) => event.type === "SIGNUP").length

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/influenciadores" className="inline-flex items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Programa
          </Link>
          <span className="rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur">
            Status: {profile.status === "PENDING" ? "Aguardando aprovação" : profile.status}
          </span>
        </div>

        <section className="relative flex flex-col items-center text-center">
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />
          <p className="relative z-10 mt-4 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            Dashboard FindB Europa
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-primary text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            Olá, {profile.name}
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            Seu link exclusivo, campanhas, materiais, ganhos e estatísticas em uma área simples para compartilhar.
          </p>
        </section>

        <section className="grid gap-3">
          <div className="rounded-[1.2rem] bg-white/90 p-5 shadow-[0_18px_45px_-32px_rgba(33,33,156,0.78)] ring-1 ring-white/90 sm:p-6">
            <div className="grid gap-2 sm:grid-cols-3">
              <Metric icon={BadgeEuro} label="Disponível" value={formatEuro(profile.availableCents)} />
              <Metric icon={BadgeEuro} label="Pendente" value={formatEuro(profile.pendingCents)} />
              <Metric icon={Trophy} label="Código" value={profile.referralCode} />
            </div>
          </div>

          <div className="rounded-[1.2rem] bg-white/90 p-4 shadow-[0_18px_45px_-32px_rgba(33,33,156,0.78)] ring-1 ring-white/90 sm:p-5">
            <div className="flex items-center gap-3">
              <Link2 className="size-5 text-accent" aria-hidden="true" />
              <h2 className="font-display text-xl font-extrabold text-primary">Meu link</h2>
            </div>
            <div className="mt-3 rounded-lg bg-primary/5 p-3 text-xs font-bold leading-relaxed text-primary ring-1 ring-primary/6 break-all">
              {referralUrl}
            </div>
            <div className="mt-3 grid grid-cols-[112px_1fr] gap-3">
              <div className="rounded-lg bg-white p-2 ring-1 ring-primary/8" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <ReferralActions referralUrl={referralUrl} eventUrl={`/api/influenciadores/${profile.referralSlug}/evento?type=SHARE`} />
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Metric icon={BarChart3} label="Cliques" value={String(clicks)} />
          <Metric icon={CheckCircle2} label="Cadastros" value={String(conversions)} />
          <Metric icon={Megaphone} label="Compartilhamentos" value={String(shares)} />
        </section>

        <section className="grid gap-3">
          <Panel title="Campanhas">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-lg bg-primary/5 p-3 ring-1 ring-primary/6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-primary">{campaign.title}</h3>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{campaign.objective}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-accent">{formatEuro(campaign.rewardCents)}</span>
                </div>
              </div>
            ))}
          </Panel>

          <Panel title="Central de conteúdo">
            {assets.map((asset) => (
              <a key={asset.id} href={asset.url} className="flex items-center gap-3 rounded-lg bg-primary/5 p-3 ring-1 ring-primary/6 transition hover:bg-white">
                <Download className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-extrabold text-primary">{asset.title}</span>
                  <span className="block text-xs font-semibold leading-relaxed text-muted-foreground">{asset.description}</span>
                </span>
              </a>
            ))}
          </Panel>
        </section>

        <section className="grid gap-3">
          <Panel title="Extrato">
            {profile.earnings.length ? (
              profile.earnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between gap-3 rounded-lg bg-primary/5 p-3 text-xs font-bold ring-1 ring-primary/6">
                  <span className="text-primary">{earning.description}</span>
                  <span className="text-accent">{formatEuro(earning.amountCents)}</span>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-primary/5 p-3 text-xs font-semibold leading-relaxed text-muted-foreground">
                Seus ganhos aparecem aqui quando campanhas forem validadas pela equipe.
              </p>
            )}
          </Panel>

          <Panel title="Ranking e desafios">
            {["Ranking semanal", "Ranking mensal", "Missões especiais", "Bônus por indicação"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-xs font-extrabold text-primary ring-1 ring-primary/6">
                <Trophy className="size-4 text-accent" aria-hidden="true" />
                {item}
              </div>
            ))}
          </Panel>
        </section>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, label, value }: { icon: typeof BadgeEuro; label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-white/90 p-3 shadow-[0_14px_34px_-28px_rgba(33,33,156,0.72)] ring-1 ring-white/90">
      <Icon className="size-5 text-accent" aria-hidden="true" />
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-display text-lg font-extrabold text-primary">{value}</p>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.2rem] bg-white/88 p-4 ring-1 ring-white/90 sm:p-5">
      <h2 className="font-display text-xl font-extrabold text-primary">{title}</h2>
      <div className="mt-3 grid gap-2">{children}</div>
    </section>
  )
}

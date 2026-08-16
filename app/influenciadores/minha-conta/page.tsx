import Link from "next/link"
import { headers } from "next/headers"
import QRCode from "qrcode"
import { ArrowLeft, BadgeEuro, BarChart3, CheckCircle2, Download, Link2, LogOut, Megaphone, ShieldCheck, Trophy } from "lucide-react"
import { logout } from "@/app/actions"
import { AuthenticatedTopBar } from "@/components/findb/authenticated-top-bar"
import { BrandLogo } from "@/components/findb/brand-logo"
import { ReferralActions } from "@/components/findb/referral-actions"
import { requireInfluencerSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatEuro, makeReferralUrlFromHeaders } from "@/lib/influencer-program"
import { getReferralMetrics } from "@/lib/referral-events"
import { getServerCopy, getServerLang, localizeContentAsset, statusLabel } from "@/lib/server-copy"

export const dynamic = "force-dynamic"

export default async function InfluencerAccountPage() {
  const { profile } = await requireInfluencerSession()
  const [c, lang] = await Promise.all([getServerCopy(), getServerLang()])
  const [fullProfile, campaigns, assets, metrics] = await Promise.all([
    prisma.influencerProfile.findUnique({
      where: { id: profile.id },
      include: {
        earnings: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    }),
    prisma.campaign.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.contentAsset.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    getReferralMetrics(profile.id),
  ])

  if (!fullProfile) {
    return null
  }

  const referralUrl = makeReferralUrlFromHeaders(fullProfile.referralSlug, await headers())
  const qrSvg = await QRCode.toString(referralUrl, {
    type: "svg",
    margin: 1,
    color: {
      dark: "#21219c",
      light: "#ffffff",
    },
  })
  const { clicks, shares, conversions } = metrics

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <AuthenticatedTopBar
          left={
            <Link href="/influenciadores" className="inline-flex items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
              <ArrowLeft className="size-4" aria-hidden="true" />
              {c.common.program}
            </Link>
          }
          right={
            <form action={logout}>
              <button className="inline-flex min-h-9 items-center gap-2 rounded-full bg-white/72 px-3 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
                <LogOut className="size-4" aria-hidden="true" />
                {c.common.logout}
              </button>
            </form>
          }
        />

        <section className="relative flex flex-col items-center text-center">
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />
          <p className="relative z-10 mt-4 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.account.eyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-primary text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            {c.account.hello} {fullProfile.name}
          </h1>
          <p className="relative z-10 mt-3 rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80">
            {c.common.status}: {statusLabel(fullProfile.status, c.common)}
          </p>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-3 sm:p-5">
          <MiniStat icon={BadgeEuro} label={c.common.available} value={formatEuro(fullProfile.availableCents)} />
          <MiniStat icon={BadgeEuro} label={c.common.pending} value={formatEuro(fullProfile.pendingCents)} />
          <MiniStat icon={Trophy} label={c.common.code} value={fullProfile.referralCode} />
        </section>

        <section className="rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-brand text-white shadow-[0_12px_24px_-18px_rgba(33,33,156,0.9)]">
              <Link2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-accent">{c.account.myLink}</p>
              <h2 className="font-display text-lg font-extrabold leading-tight text-primary">{c.account.exclusiveUrl}</h2>
            </div>
          </div>

          <div className="mt-3 rounded-[0.9rem] bg-primary/5 px-3 py-2.5 text-xs font-bold leading-relaxed text-primary ring-1 ring-primary/6 break-all">
            {referralUrl}
          </div>

          <div className="mt-3 grid gap-3 min-[420px]:grid-cols-[116px_1fr]">
            <div className="rounded-[0.9rem] bg-white p-2 shadow-[0_12px_30px_-24px_rgba(33,33,156,0.72)] ring-1 ring-primary/8" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <ReferralActions referralUrl={referralUrl} eventUrl={`/api/influenciadores/${fullProfile.referralSlug}/evento?type=SHARE`} />
          </div>
        </section>

        <section className="grid gap-2.5 sm:grid-cols-3">
          <Metric icon={BarChart3} label={c.account.clicks} value={String(clicks)} />
          <Metric icon={CheckCircle2} label={c.account.registrations} value={String(conversions)} />
          <Metric icon={Megaphone} label={c.account.shares} value={String(shares)} />
        </section>

        <Panel title={c.account.campaigns}>
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

        <Panel title={c.account.contentHub}>
          {assets.map((asset) => {
            const localizedAsset = localizeContentAsset(asset, lang)

            return (
              <a key={asset.id} href={asset.url} className="flex items-center gap-3 rounded-lg bg-primary/5 p-3 ring-1 ring-primary/6 transition hover:bg-white">
                <Download className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-extrabold text-primary">{localizedAsset.title}</span>
                  <span className="block text-xs font-semibold leading-relaxed text-muted-foreground">{localizedAsset.description}</span>
                </span>
              </a>
            )
          })}
        </Panel>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, label, value }: { icon: typeof BadgeEuro; label: string; value: string }) {
  return (
    <div className="group rounded-[1rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur">
      <span className="grid size-8 place-items-center rounded-full bg-accent/8 text-accent transition group-hover:bg-accent group-hover:text-white">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-display text-lg font-extrabold leading-tight text-primary">{value}</p>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof BadgeEuro; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[0.9rem] bg-primary/5 px-3 py-2 text-left ring-1 ring-primary/6">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-accent shadow-[0_8px_18px_-16px_rgba(33,33,156,0.6)]">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
        <span className="block break-words font-display text-sm font-extrabold leading-tight text-primary">{value}</span>
      </span>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.2rem] bg-white/88 p-4 shadow-[0_18px_45px_-34px_rgba(33,33,156,0.72)] ring-1 ring-white/90 backdrop-blur sm:p-5">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-accent" aria-hidden="true" />
        <h2 className="font-display text-lg font-extrabold text-primary">{title}</h2>
      </div>
      <div className="mt-3 grid gap-2">{children}</div>
    </section>
  )
}

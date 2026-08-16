import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  BadgeEuro,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Link2,
  LogOut,
  ShieldCheck,
  UsersRound,
  XCircle,
} from "lucide-react"
import { logout } from "@/app/actions"
import { AuthenticatedTopBar } from "@/components/findb/authenticated-top-bar"
import { BrandLogo } from "@/components/findb/brand-logo"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { requireAdminSession } from "@/lib/auth"
import { formatEuro } from "@/lib/influencer-program"
import { prisma } from "@/lib/prisma"
import { getServerCopy, statusLabel } from "@/lib/server-copy"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const { admin } = await requireAdminSession()
  const c = await getServerCopy()

  const [profiles, campaigns, homeLinks, documents, earnings, total, statusGroups] = await Promise.all([
    prisma.influencerProfile.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.campaign.count({ where: { status: "ACTIVE" } }),
    prisma.homeLink.count({ where: { isActive: true } }),
    prisma.contentAsset.count(),
    prisma.earning.aggregate({ _sum: { amountCents: true } }),
    prisma.influencerProfile.count(),
    prisma.influencerProfile.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ])

  const counts = new Map(statusGroups.map((group) => [group.status, group._count.status]))
  const pending = counts.get("PENDING") ?? 0
  const approved = counts.get("APPROVED") ?? 0
  const rejected = counts.get("REJECTED") ?? 0
  const totalEarnings = formatEuro(earnings._sum.amountCents ?? 0)

  const stats = [
    { icon: UsersRound, label: c.adminHome.statsInfluencers, value: String(total) },
    { icon: Clock3, label: c.adminHome.statsWaiting, value: String(pending) },
    { icon: CheckCircle2, label: c.adminHome.statsApproved, value: String(approved) },
    { icon: XCircle, label: c.adminHome.statsRejected, value: String(rejected) },
  ]

  const adminLinks = [
    {
      icon: ShieldCheck,
      title: c.adminHome.reviewRegistrations,
      subtitle: c.adminHome.reviewRegistrationsText,
      href: "/admin/influenciadores",
      tone: "bg-accent/10 text-accent",
    },
    {
      icon: BarChart3,
      title: c.adminHome.manageCampaigns,
      subtitle: c.adminHome.campaignsCount(campaigns),
      href: "/admin/campanhas",
      tone: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: BadgeEuro,
      title: c.adminHome.earnings,
      subtitle: totalEarnings,
      href: "/admin/ganhos",
      tone: "bg-emerald-500/12 text-emerald-600",
    },
    {
      icon: Link2,
      title: c.adminHome.homeLinks,
      subtitle: c.adminHome.homeLinksCount(homeLinks),
      href: "/admin/links",
      tone: "bg-violet-500/10 text-violet-600",
    },
    {
      icon: FileText,
      title: c.adminHome.documents,
      subtitle: c.adminHome.documentsCount(documents),
      href: "/admin/documentos",
      tone: "bg-cyan-500/10 text-cyan-600",
    },
  ]

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <AuthenticatedTopBar
          left={
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
              FindB Europa
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
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-28 min-[390px]:size-32 sm:size-36" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.adminHome.eyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{c.adminHome.hello}</span>{" "}
            <span className="text-accent">{admin.name}</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {c.adminHome.description}
          </p>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-2 sm:p-5">
          {stats.map((stat) => (
            <StatPill key={stat.label} {...stat} />
          ))}
        </section>

        <section className="flex flex-col gap-2.5">
          {adminLinks.map((item) => (
            <AdminLinkCard key={item.title} {...item} />
          ))}
        </section>

        <section className="rounded-[1.2rem] bg-white/88 p-4 shadow-[0_18px_45px_-34px_rgba(33,33,156,0.72)] ring-1 ring-white/90 backdrop-blur sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                {c.adminHome.latestRegistrations}
              </p>
              <h2 className="font-display text-xl font-extrabold text-primary">{c.adminHome.influencersToReview}</h2>
            </div>
            <Link href="/admin/influenciadores" className="inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-accent">
              {c.common.viewAll}
            </Link>
          </div>

          <div className="mt-4 grid gap-2">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <div key={profile.id} className="grid gap-2 rounded-lg bg-primary/5 p-3 ring-1 ring-primary/6 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-primary">{profile.name}</h3>
                    <p className="mt-1 break-words text-xs font-semibold leading-relaxed text-muted-foreground">
                      {profile.email} · {profile.country} · {profile.socialHandle}
                    </p>
                  </div>
                  <StatusPill label={statusLabel(profile.status, c.common)} />
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-primary/5 px-3 py-4 text-center ring-1 ring-primary/6">
                <p className="text-xs font-extrabold leading-relaxed text-muted-foreground">
                  {c.adminHome.emptyLatestRegistrations}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function StatPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
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

function AdminLinkCard({
  icon: Icon,
  title,
  subtitle,
  href,
  tone,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
  href: string
  tone: string
}) {
  return (
    <Link href={href} className="findb-link-card group relative flex min-h-[66px] items-center gap-3 overflow-hidden rounded-[1.15rem] bg-white/88 px-3 py-2.5 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_38px_-24px_rgba(33,33,156,0.78)] hover:ring-white/90 min-[390px]:gap-3.5 min-[390px]:rounded-[1.2rem] min-[390px]:px-4 sm:min-h-[74px] sm:gap-4 sm:px-5 sm:py-3">
      <span aria-hidden="true" className="findb-link-shine" />
      <span className={`findb-link-icon grid size-11 shrink-0 place-items-center rounded-full min-[390px]:size-12 sm:size-[52px] ${tone}`}>
        <Icon className="size-[22px] transition-transform duration-300 group-hover:scale-110 min-[390px]:size-6 sm:size-[26px]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-display text-[14px] font-semibold leading-snug text-primary text-pretty min-[390px]:text-[15px] sm:text-base">
          {title}
        </span>
        <span className="block text-[11.5px] font-semibold leading-snug text-muted-foreground text-pretty min-[390px]:text-[12.5px] sm:text-[13.5px]">
          {subtitle}
        </span>
      </span>
      <span className="findb-link-arrow grid size-7 shrink-0 place-items-center rounded-full bg-accent/8 text-accent transition-transform min-[390px]:size-8 sm:size-9">
        <ChevronRight className="size-5" aria-hidden="true" />
      </span>
    </Link>
  )
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-primary ring-1 ring-primary/8">
      {label}
    </span>
  )
}

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowLeft,
  AtSign,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Tag,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { InfluencerStatusDialog } from "@/components/findb/influencer-status-dialog"
import { ToastMessage } from "@/components/findb/toast-message"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerCopy, getServerLang, statusLabel, type ServerLang } from "@/lib/server-copy"
import { getToastFromSearchParams } from "@/lib/toast"

export const dynamic = "force-dynamic"

const localeByLang: Record<ServerLang, string> = {
  ptBr: "pt-BR",
  ptPt: "pt-PT",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminInfluencersPage({ searchParams }: PageProps) {
  await requireAdminSession()
  const [c, lang] = await Promise.all([getServerCopy(), getServerLang()])
  const toast = await getToastFromSearchParams(searchParams)
  const dateFormatter = new Intl.DateTimeFormat(localeByLang[lang], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const profiles = await prisma.influencerProfile.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  })

  const pending = profiles.filter((profile) => profile.status === "PENDING").length
  const approved = profiles.filter((profile) => profile.status === "APPROVED").length
  const rejected = profiles.filter((profile) => profile.status === "REJECTED").length
  const suspended = profiles.filter((profile) => profile.status === "SUSPENDED").length

  const stats = [
    { icon: Clock3, label: c.adminLists.pendingPlural, value: pending },
    { icon: CheckCircle2, label: c.adminLists.approvedPlural, value: approved },
    { icon: XCircle, label: c.adminLists.rejectedPlural, value: rejected },
    { icon: ShieldAlert, label: c.adminLists.suspendedPlural, value: suspended },
  ]

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <ToastMessage type={toast?.type} message={toast?.message} />
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {c.common.admin}
          </Link>
          <span className="rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur">
            {c.adminLists.registrationsCount(profiles.length)}
          </span>
        </div>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.adminLists.moderation}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{c.adminLists.influencerApprovalStart}</span>{" "}
            <span className="text-accent">{c.adminLists.influencerApprovalAccent}</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {c.adminLists.influencerApprovalDescription}
          </p>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-2 sm:p-5">
          {stats.map((stat) => (
            <Summary key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid gap-3">
          {profiles.length ? (
            profiles.map((profile) => (
              <article key={profile.id} className="findb-link-card group relative overflow-hidden rounded-[1.2rem] bg-white/90 p-3.5 shadow-[0_18px_45px_-34px_rgba(33,33,156,0.72)] ring-1 ring-white/85 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white min-[390px]:p-4 sm:p-5">
                <span aria-hidden="true" className="findb-link-shine" />
                <span aria-hidden="true" className="absolute right-0 top-0 h-24 w-24 rounded-bl-[3rem] bg-gradient-to-br from-accent/12 to-blue-500/10" />

                <div className="relative z-10 grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div className="grid min-w-0 grid-cols-[auto_1fr] gap-3">
                      <Avatar name={profile.name} />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill status={profile.status} labels={c.common} />
                          <span className="rounded-full bg-primary/5 px-3 py-1.5 text-[11px] font-extrabold text-primary ring-1 ring-primary/6">
                            {dateFormatter.format(profile.createdAt)}
                          </span>
                        </div>

                        <h2 className="mt-2 font-display text-[17px] font-extrabold leading-tight text-primary min-[390px]:text-lg sm:text-xl">
                          {profile.name}
                        </h2>

                        <div className="mt-2 grid gap-1.5 min-[520px]:grid-cols-2">
                          <ContactPill icon={Mail} value={profile.email} />
                          <ContactPill icon={Phone} value={profile.whatsapp} />
                        </div>
                      </div>
                    </div>

                    <Link href={`/i/${profile.referralSlug}`} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent sm:w-fit">
                      {c.adminLists.publicLink}
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Info icon={Globe2} label={c.adminLists.country} value={profile.country} tone="blue" />
                    <Info icon={MapPin} label={c.adminLists.city} value={profile.city || c.adminLists.notInformed} tone="pink" />
                    <Info icon={AtSign} label={c.adminLists.network} value={profile.primaryNetwork} tone="blue" />
                    <Info icon={UserRound} label={c.adminLists.profile} value={profile.socialHandle} tone="pink" />
                    <Info icon={UsersRound} label={c.adminLists.followers} value={profile.audienceSize ? String(profile.audienceSize) : c.adminLists.notInformed} tone="blue" />
                    <Info icon={Tag} label={c.common.code} value={profile.referralCode} tone="pink" />
                    <Info icon={Tag} label={c.adminLists.categories} value={profile.categories} tone="blue" wide />
                    <Info icon={Languages} label={c.adminLists.languages} value={profile.languages} tone="pink" />
                  </div>

                  {profile.motivation && (
                    <div className="rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,248,255,0.78))] p-3 ring-1 ring-primary/6">
                      <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-accent">{c.adminLists.motivation}</p>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                        {profile.motivation}
                      </p>
                    </div>
                  )}

                  <div className="rounded-[1rem] bg-primary/5 p-2 ring-1 ring-primary/6">
                    <InfluencerStatusDialog
                      id={profile.id}
                      name={profile.name}
                      currentStatus={profile.status}
                      labels={{
                        trigger: c.adminLists.changeStatus,
                        title: c.adminLists.statusDialogTitle,
                        close: c.common.close,
                        current: c.adminLists.current,
                        options: {
                          APPROVED: { label: c.adminLists.approve, description: c.adminLists.approveDescription },
                          REJECTED: { label: c.adminLists.reject, description: c.adminLists.rejectDescription },
                          SUSPENDED: { label: c.adminLists.suspend, description: c.adminLists.suspendDescription },
                          PENDING: { label: c.adminLists.backToPending, description: c.adminLists.backToPendingDescription },
                        },
                      }}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.2rem] bg-white/88 p-5 text-center text-sm font-bold text-muted-foreground ring-1 ring-white/90">
              {c.adminLists.noRegistrations}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Summary({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-[0.9rem] bg-primary/5 px-3 py-2 text-left ring-1 ring-primary/6">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-accent shadow-[0_8px_18px_-16px_rgba(33,33,156,0.6)]">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
        <span className="block font-display text-sm font-extrabold leading-tight text-primary">{value}</span>
      </span>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "F"

  return (
    <span className="findb-link-icon grid size-11 shrink-0 place-items-center rounded-full bg-gradient-brand font-display text-base font-extrabold text-white shadow-[0_12px_24px_-18px_rgba(33,33,156,0.9)] sm:size-[52px]">
      {initial}
    </span>
  )
}

function ContactPill({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-white/72 px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground ring-1 ring-white/80">
      <Icon className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
      <span className="min-w-0 truncate">{value}</span>
    </span>
  )
}

function Info({
  icon: Icon,
  label,
  value,
  tone,
  wide,
}: {
  icon: LucideIcon
  label: string
  value: string
  tone: "blue" | "pink"
  wide?: boolean
}) {
  const iconTone = tone === "blue" ? "bg-blue-500/10 text-blue-600" : "bg-accent/10 text-accent"

  return (
    <div className={`grid grid-cols-[auto_1fr] gap-2 rounded-[1rem] bg-white/64 p-2.5 ring-1 ring-primary/6 ${wide ? "sm:col-span-2" : ""}`}>
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

function StatusPill({ status, labels }: { status: string; labels: Parameters<typeof statusLabel>[1] }) {
  const label = statusLabel(status, labels)
  return (
    <span className="w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-primary shadow-sm ring-1 ring-primary/8">
      {label}
    </span>
  )
}

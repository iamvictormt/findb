import Link from "next/link"
import { ArrowLeft, BadgeEuro, Clock3, CreditCard, Plus, WalletCards } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { DeleteEarningDialog } from "@/components/findb/delete-earning-dialog"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { ToastMessage } from "@/components/findb/toast-message"
import { requireAdminSession } from "@/lib/auth"
import { formatEuro } from "@/lib/influencer-program"
import { prisma } from "@/lib/prisma"
import { getServerCopy, getServerLang, type ServerLang } from "@/lib/server-copy"
import { getToastFromSearchParams } from "@/lib/toast"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const localeByLang: Record<ServerLang, string> = {
  ptBr: "pt-BR",
  ptPt: "pt-PT",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
}

export default async function AdminEarningsPage({ searchParams }: PageProps) {
  await requireAdminSession()
  const [c, lang] = await Promise.all([getServerCopy(), getServerLang()])
  const toast = await getToastFromSearchParams(searchParams)
  const dateFormatter = new Intl.DateTimeFormat(localeByLang[lang], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const [earnings, totals] = await Promise.all([
    prisma.earning.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        influencer: true,
        campaign: true,
      },
      take: 40,
    }),
    prisma.earning.groupBy({
      by: ["status"],
      _sum: { amountCents: true },
    }),
  ])

  const totalByStatus = new Map(totals.map((item) => [item.status, item._sum.amountCents ?? 0]))

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <ToastMessage type={toast?.type} message={toast?.message} />
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {c.common.admin}
          </Link>
          <Link href="/admin/ganhos/novo" className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-accent">
            <Plus className="size-4" aria-hidden="true" />
            {c.adminLists.newEarning}
          </Link>
        </div>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.adminLists.earningsEyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{c.adminLists.earningsTitleStart}</span>{" "}
            <span className="text-accent">{c.adminLists.earningsTitleAccent}</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {c.adminLists.earningsDescription}
          </p>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-3 sm:p-5">
          <Summary icon={Clock3} label={c.common.pending} value={formatEuro(totalByStatus.get("PENDING") ?? 0)} />
          <Summary icon={WalletCards} label={c.common.available} value={formatEuro(totalByStatus.get("AVAILABLE") ?? 0)} />
          <Summary icon={CreditCard} label={c.common.paid} value={formatEuro(totalByStatus.get("PAID") ?? 0)} />
        </section>

        <section className="grid gap-2.5">
          {earnings.length ? (
            earnings.map((earning) => (
              <article key={earning.id} className="findb-link-card relative overflow-hidden rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:p-5">
                <span aria-hidden="true" className="findb-link-shine" />
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 min-[390px]:size-12">
                    <BadgeEuro className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={earning.status} labels={c.common} />
                      <span className="rounded-full bg-primary/5 px-3 py-1.5 text-[11px] font-extrabold text-primary ring-1 ring-primary/6">
                        {formatEuro(earning.amountCents)}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-lg font-extrabold leading-tight text-primary">
                      {earning.description}
                    </h2>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                      {earning.influencer.name} · {earning.campaign?.title ?? c.adminLists.noCampaign} · {dateFormatter.format(earning.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <DeleteEarningDialog
                    id={earning.id}
                    description={earning.description}
                    labels={{
                      trigger: c.common.delete,
                      title: c.adminLists.deleteEarningTitle,
                      description: c.adminLists.deleteEarningDescription,
                      close: c.common.close,
                      cancel: c.common.cancel,
                      confirm: c.common.confirmDelete,
                    }}
                  />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.2rem] bg-white/88 p-5 text-center text-sm font-bold text-muted-foreground ring-1 ring-white/90">
              {c.adminLists.noEarnings}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Summary({ icon: Icon, label, value }: { icon: typeof BadgeEuro; label: string; value: string }) {
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

function StatusPill({ status, labels }: { status: string; labels: { pending: string; available: string; paid: string; canceled: string } }) {
  const label = status === "PENDING" ? labels.pending : status === "AVAILABLE" ? labels.available : status === "PAID" ? labels.paid : labels.canceled
  return (
    <span className="w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-primary ring-1 ring-primary/8">
      {label}
    </span>
  )
}

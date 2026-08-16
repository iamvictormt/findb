import Link from "next/link"
import { ArrowLeft, BadgeEuro, CalendarClock, Edit3, Plus, ShieldCheck } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { DeleteCampaignDialog } from "@/components/findb/delete-campaign-dialog"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { ToastMessage } from "@/components/findb/toast-message"
import { requireAdminSession } from "@/lib/auth"
import { formatEuro } from "@/lib/influencer-program"
import { prisma } from "@/lib/prisma"
import { getServerCopy, getServerLang, type ServerLang } from "@/lib/server-copy"
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

export default async function AdminCampaignsPage({ searchParams }: PageProps) {
  await requireAdminSession()
  const [c, lang] = await Promise.all([getServerCopy(), getServerLang()])
  const toast = await getToastFromSearchParams(searchParams)
  const dateFormatter = new Intl.DateTimeFormat(localeByLang[lang], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const campaigns = await prisma.campaign.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { earnings: true } },
    },
  })

  const active = campaigns.filter((campaign) => campaign.status === "ACTIVE").length
  const scheduledOrDraft = campaigns.filter((campaign) => campaign.status === "DRAFT" || campaign.status === "PAUSED").length
  const ended = campaigns.filter((campaign) => campaign.status === "ENDED").length

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
          <Link href="/admin/campanhas/nova" className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-accent">
            <Plus className="size-4" aria-hidden="true" />
            {c.adminLists.newCampaign}
          </Link>
        </div>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.adminLists.campaignsEyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{c.adminLists.campaignsTitleStart}</span>{" "}
            <span className="text-accent">{c.adminLists.campaignsTitleAccent}</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {c.adminLists.campaignsDescription}
          </p>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-3 sm:p-5">
          <Summary icon={ShieldCheck} label={c.adminLists.activeCampaigns} value={active} />
          <Summary icon={CalendarClock} label={c.adminLists.pausedDraft} value={scheduledOrDraft} />
          <Summary icon={BadgeEuro} label={c.adminLists.endedCampaigns} value={ended} />
        </section>

        <section className="grid gap-2.5">
          {campaigns.length ? (
            campaigns.map((campaign) => (
              <article key={campaign.id} className="findb-link-card relative overflow-hidden rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:p-5">
                <span aria-hidden="true" className="findb-link-shine" />
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent min-[390px]:size-12">
                    <BadgeEuro className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={campaign.status} labels={c.adminLists} />
                      <span className="rounded-full bg-primary/5 px-3 py-1.5 text-[11px] font-extrabold text-primary ring-1 ring-primary/6">
                        {formatEuro(campaign.rewardCents)}
                      </span>
                    </div>

                    <h2 className="mt-3 font-display text-lg font-extrabold leading-tight text-primary">
                      {campaign.title}
                    </h2>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                      {campaign.description}
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <Info label={c.adminLists.objective} value={campaign.objective} />
                      <Info label={c.adminLists.material} value={campaign.materialType} />
                      <Info label={c.adminLists.start} value={dateFormatter.format(campaign.startsAt)} />
                      <Info label={c.adminLists.end} value={campaign.endsAt ? dateFormatter.format(campaign.endsAt) : c.adminLists.noEndDate} />
                    </div>

                    <p className="mt-3 text-[11px] font-bold text-muted-foreground">
                      {c.adminLists.linkedEarnings(campaign._count.earnings)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Link href={`/admin/campanhas/${campaign.id}/editar`} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-accent">
                    <Edit3 className="size-4" aria-hidden="true" />
                    {c.common.edit}
                  </Link>
                  <DeleteCampaignDialog
                    id={campaign.id}
                    title={campaign.title}
                    labels={{
                      trigger: c.common.delete,
                      title: c.adminLists.deleteCampaignTitle,
                      description: c.adminLists.deleteCampaignDescription,
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
              {c.adminLists.noCampaigns}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Summary({ icon: Icon, label, value }: { icon: typeof BadgeEuro; label: string; value: number }) {
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-primary/5 p-3 ring-1 ring-primary/6">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-xs font-extrabold leading-relaxed text-primary">{value}</p>
    </div>
  )
}

function StatusPill({
  status,
  labels,
}: {
  status: string
  labels: { campaignActive: string; campaignPaused: string; campaignEnded: string; campaignDraft: string }
}) {
  const label = status === "ACTIVE" ? labels.campaignActive : status === "PAUSED" ? labels.campaignPaused : status === "ENDED" ? labels.campaignEnded : labels.campaignDraft
  return (
    <span className="w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-primary ring-1 ring-primary/8">
      {label}
    </span>
  )
}

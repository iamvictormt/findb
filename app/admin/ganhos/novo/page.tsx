import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { EarningForm } from "@/components/findb/earning-form"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerCopy } from "@/lib/server-copy"

export const dynamic = "force-dynamic"

export default async function NewEarningPage() {
  await requireAdminSession()
  const c = await getServerCopy()

  const [influencers, campaigns] = await Promise.all([
    prisma.influencerProfile.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
    prisma.campaign.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ])

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <Link href="/admin/ganhos" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {c.adminLists.earningsBack}
        </Link>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.adminLists.newEarning}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{c.adminLists.launchEarningTitleStart}</span>{" "}
            <span className="text-accent">{c.adminLists.launchEarningTitleAccent}</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {c.adminLists.newEarningDescription}
          </p>
        </section>

        <EarningForm
          influencers={influencers.map((influencer) => ({
            value: influencer.id,
            label: `${influencer.name} · ${influencer.email}`,
          }))}
          campaigns={campaigns.map((campaign) => ({
            value: campaign.id,
            label: campaign.title,
          }))}
          labels={{
            formTitle: c.adminLists.earningFormTitle,
            formDescription: c.adminLists.earningFormDescription,
            influencer: c.adminLists.influencer,
            select: c.adminLists.select,
            campaign: c.adminLists.campaign,
            noCampaign: c.adminLists.noCampaign,
            amountEuros: c.adminLists.amountEuros,
            status: c.common.status,
            pending: c.common.pending,
            available: c.common.available,
            paid: c.common.paid,
            canceled: c.common.canceled,
            description: c.adminLists.descriptionLabel,
            example: c.adminLists.earningExample,
            saving: c.adminLists.savingEarning,
            submit: c.adminLists.earningFormTitle,
          }}
        />
      </div>
    </main>
  )
}

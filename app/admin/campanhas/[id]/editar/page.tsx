import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { updateCampaign } from "@/app/admin/campanhas/actions"
import { BrandLogo } from "@/components/findb/brand-logo"
import { CampaignForm } from "@/components/findb/campaign-form"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerCopy } from "@/lib/server-copy"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditCampaignPage({ params }: PageProps) {
  await requireAdminSession()
  const c = await getServerCopy()
  const { id } = await params
  const campaign = await prisma.campaign.findUnique({
    where: { id },
  })

  if (!campaign) {
    notFound()
  }

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <Link href="/admin/campanhas" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {c.adminLists.campaignsBack}
        </Link>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.adminLists.editCampaignEyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{c.adminLists.editCampaignTitleStart}</span>{" "}
            <span className="text-accent">{campaign.title}</span>
          </h1>
        </section>

        <CampaignForm
          action={updateCampaign.bind(null, campaign.id)}
          submitLabel={c.adminLists.saveChanges}
          labels={campaignFormLabels(c)}
          values={campaign}
        />
      </div>
    </main>
  )
}

function campaignFormLabels(c: Awaited<ReturnType<typeof getServerCopy>>) {
  return {
    formTitle: c.adminLists.campaignFormTitle,
    formDescription: c.adminLists.campaignFormDescription,
    title: c.adminLists.title,
    description: c.adminLists.descriptionLabel,
    objective: c.adminLists.objective,
    rewardEuros: c.adminLists.rewardEuros,
    materialType: c.adminLists.materialType,
    status: c.adminLists.statusField,
    active: c.adminLists.campaignActive,
    paused: c.adminLists.campaignPaused,
    ended: c.adminLists.campaignEnded,
    draft: c.adminLists.campaignDraft,
    eventMaterial: c.adminLists.eventMaterial,
    startDate: c.adminLists.startDate,
    endDate: c.adminLists.endDate,
    endDateHelper: c.adminLists.endDateHelper,
    saving: c.adminLists.saving,
  }
}

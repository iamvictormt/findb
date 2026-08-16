import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowLeft, BadgeEuro, BarChart3, Download, FileText, LogIn, Megaphone, ShieldCheck, Trophy, Upload } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { InfluencerSignupForm } from "@/components/findb/influencer-signup-form"
import { LanguageSwitcher } from "@/components/findb/language-switcher"
import { acceptedCountries, formatEuro, getProgramOverview } from "@/lib/influencer-program"
import { getServerCopy, getServerLang, localizeContentAsset, publicInfluencerCopy } from "@/lib/server-copy"

export const dynamic = "force-dynamic"

export default async function InfluencerPage() {
  const [c, lang] = await Promise.all([getServerCopy(), getServerLang()])
  const pageCopy = publicInfluencerCopy[lang]
  const { campaigns, assets } = await getProgramOverview()
  const quickActions = getQuickActions(assets, pageCopy)

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {c.common.backToBio}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher align="right" />
            <Link href="/influenciadores/entrar" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-accent">
              <LogIn className="size-4" aria-hidden="true" />
              {pageCopy.dashboard}
            </Link>
          </div>
        </div>

        <section className="relative flex flex-col items-center text-center">
          <BrandLogo className="relative z-10 size-28 min-[390px]:size-32 sm:size-36" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {pageCopy.eyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{pageCopy.titleStart}</span>{" "}
            <span className="text-accent">{pageCopy.titleAccent}</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {pageCopy.description}
          </p>

          <a
            href="#cadastro"
            className="relative z-10 mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent"
          >
            <BadgeEuro className="size-4" aria-hidden="true" />
            {pageCopy.cta}
          </a>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-3 sm:p-5">
          {pageCopy.highlights.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-[0.9rem] bg-primary/5 px-3 py-2 text-left text-[11px] font-bold leading-snug text-primary/82 ring-1 ring-primary/6">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-accent shadow-[0_8px_18px_-16px_rgba(33,33,156,0.6)]">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </section>

        <section id="cadastro" className="scroll-mt-6">
          <InfluencerSignupForm />
        </section>

        <section className="grid gap-3">
          <InfoBlock title={pageCopy.whoCanJoinTitle} icon={Megaphone} items={pageCopy.whoCanJoinItems} />
          <InfoBlock title={pageCopy.earningWaysTitle} icon={BadgeEuro} items={pageCopy.earningWaysItems} />
          <InfoBlock title={pageCopy.benefitsTitle} icon={Trophy} items={pageCopy.benefitsItems} />
        </section>

        <section className="rounded-[1.2rem] bg-white/88 p-4 shadow-[0_18px_45px_-34px_rgba(33,33,156,0.72)] ring-1 ring-white/90 backdrop-blur sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">{pageCopy.influencerArea}</p>
              <h2 className="font-display text-xl font-extrabold text-primary">{pageCopy.dashboardMenu}</h2>
            </div>
            <BarChart3 className="size-6 text-accent" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {pageCopy.menuItems.map(([title, description]) => (
              <div key={title} className="rounded-lg bg-primary/5 p-3 ring-1 ring-primary/6">
                <h3 className="font-display text-sm font-extrabold text-primary">{title}</h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-3">
          <div className="rounded-[1.2rem] bg-white/88 p-4 ring-1 ring-white/90 sm:p-5">
            <h2 className="font-display text-xl font-extrabold text-primary">{pageCopy.availableCampaigns}</h2>
            <div className="mt-3 grid gap-2">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-lg bg-white p-3 ring-1 ring-primary/8">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-primary">{campaign.title}</h3>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{campaign.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                      {formatEuro(campaign.rewardCents)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.2rem] bg-white/88 p-4 ring-1 ring-white/90 sm:p-5">
            <h2 className="font-display text-xl font-extrabold text-primary">{c.account.contentHub}</h2>
            <div className="mt-3 grid gap-2">
              {assets.map((asset) => {
                const localizedAsset = localizeContentAsset(asset, lang)

                return (
                  <a key={asset.id} href={asset.url} className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-primary/8 transition hover:text-accent">
                    <Download className="size-5 shrink-0 text-accent" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-extrabold text-primary">{localizedAsset.title}</span>
                      <span className="block text-xs font-semibold leading-relaxed text-muted-foreground">{localizedAsset.description}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-2 rounded-[1.2rem] bg-primary p-3 text-white shadow-[0_18px_45px_-32px_rgba(33,33,156,0.78)] sm:grid-cols-2 sm:p-4">
          {quickActions.map((action) => (
            <QuickActionLink key={action.label} {...action} />
          ))}
        </section>

        <section className="rounded-[1.2rem] bg-white/82 p-4 text-center ring-1 ring-white/90">
          <h2 className="font-display text-lg font-extrabold text-primary">{pageCopy.acceptedCountriesTitle}</h2>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">
            {pageCopy.acceptedCountriesText(acceptedCountries.slice(0, -1).join(", "))}
          </p>
        </section>
      </div>
    </main>
  )
}

type ContentAsset = Awaited<ReturnType<typeof getProgramOverview>>["assets"][number]

function getQuickActions(assets: ContentAsset[], labels: typeof publicInfluencerCopy[keyof typeof publicInfluencerCopy]) {
  const regulation = assets.find((asset) => asset.type === "REGULATION")
  const material = assets.find((asset) => ["MATERIAL", "STORY", "SCRIPT", "BRAND"].includes(asset.type))
  const submission = assets.find((asset) => asset.type === "SUBMISSION")

  return [
    { icon: FileText, label: labels.quickRegulation, href: regulation?.url, disabled: !regulation },
    { icon: Download, label: labels.quickMaterials, href: material?.url, disabled: !material },
    { icon: Upload, label: labels.quickSubmit, href: submission?.url, disabled: !submission },
    { icon: BarChart3, label: labels.dashboard, href: "/influenciadores/entrar", disabled: false },
  ]
}

function QuickActionLink({
  icon: Icon,
  label,
  href,
  disabled,
}: {
  icon: LucideIcon
  label: string
  href?: string
  disabled: boolean
}) {
  const isExternal = Boolean(href?.startsWith("http"))

  return (
    <a
      href={href ?? "#top"}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-disabled={disabled}
      className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-3 text-xs font-extrabold ring-1 ring-white/15 transition hover:bg-white hover:text-primary aria-disabled:pointer-events-none aria-disabled:opacity-55"
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </a>
  )
}

function InfoBlock({
  title,
  items,
  icon: Icon,
}: {
  title: string
  items: string[]
  icon: typeof BadgeEuro
}) {
  return (
    <section className="rounded-[1.2rem] bg-white/88 p-4 shadow-[0_18px_45px_-34px_rgba(33,33,156,0.72)] ring-1 ring-white/90 backdrop-blur sm:p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-accent" aria-hidden="true" />
        <h2 className="font-display text-lg font-extrabold text-primary">{title}</h2>
      </div>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-primary/5 px-3 py-2 text-xs font-bold leading-relaxed text-primary/82 ring-1 ring-primary/6">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

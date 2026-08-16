import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { InfluencerLoginForm } from "@/components/findb/influencer-login-form"
import { LanguageSwitcher } from "@/components/findb/language-switcher"
import { redirectAuthenticatedSession } from "@/lib/auth"
import { getServerCopy } from "@/lib/server-copy"

export const dynamic = "force-dynamic"

export default async function InfluencerLoginPage() {
  await redirectAuthenticatedSession()
  const c = await getServerCopy()

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <div className="relative z-[140] flex items-center justify-between gap-3">
          <Link href="/influenciadores" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {c.common.program}
          </Link>
          <LanguageSwitcher align="right" />
        </div>

        <section className="relative flex flex-col items-center text-center">
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />
          <p className="relative z-10 mt-4 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.influencerLogin.eyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-primary text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            {c.influencerLogin.title}
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {c.influencerLogin.description}
          </p>
        </section>

        <InfluencerLoginForm />
      </div>
    </main>
  )
}

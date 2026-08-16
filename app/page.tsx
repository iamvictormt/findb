import { BrandLogo } from "@/components/findb/brand-logo"
import { FlagMarquee } from "@/components/findb/flag-marquee"
import { HeroCopy } from "@/components/findb/hero-copy"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { HomeTopBar } from "@/components/findb/home-top-bar"
import { InfluencerProgram } from "@/components/findb/influencer-program"
import { LinkCards } from "@/components/findb/link-cards"
import { MemberCards } from "@/components/findb/member-cards"
import { SocialFooter } from "@/components/findb/social-footer"
import { StatsRow } from "@/components/findb/stats-row"
import { getActiveHomeLinks } from "@/lib/home-links"

export const dynamic = "force-dynamic"

export default async function Page() {
  const links = await getActiveHomeLinks()

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />
      <HomeTopBar />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-18 min-[390px]:px-4 sm:px-6 sm:pt-20 lg:max-w-[720px]">
        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-36 min-[390px]:size-40 sm:size-44" />

          <h1 className="relative z-10 mt-5 font-display text-[2.15rem] font-semibold leading-none tracking-normal text-balance min-[390px]:text-[2.45rem] sm:text-5xl">
            <span className="text-primary">FindB</span>{" "}
            <span className="text-accent">Europa</span>
          </h1>

          <HeroCopy />
        </section>

        <StatsRow />
        <LinkCards links={links} />
        <MemberCards />
        <InfluencerProgram />
        <FlagMarquee />
        <SocialFooter />
      </div>
    </main>
  )
}

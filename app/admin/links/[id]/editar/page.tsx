import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { updateHomeLink } from "@/app/admin/links/actions"
import { BrandLogo } from "@/components/findb/brand-logo"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { HomeLinkForm } from "@/components/findb/home-link-form"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditHomeLinkPage({ params }: PageProps) {
  await requireAdminSession()
  const { id } = await params
  const link = await prisma.homeLink.findUnique({ where: { id } })

  if (!link) {
    notFound()
  }

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <Link href="/admin/links" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Links da home
        </Link>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            Editar destaque
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">Alterar</span>{" "}
            <span className="text-accent">link da home</span>
          </h1>
        </section>

        <HomeLinkForm
          action={updateHomeLink.bind(null, link.id)}
          values={{
            title: link.title,
            subtitle: link.subtitle,
            titlePtPt: link.titlePtPt,
            subtitlePtPt: link.subtitlePtPt,
            titleEn: link.titleEn,
            subtitleEn: link.subtitleEn,
            titleEs: link.titleEs,
            subtitleEs: link.subtitleEs,
            titleFr: link.titleFr,
            subtitleFr: link.subtitleFr,
            href: link.href,
            icon: link.icon,
            tone: link.tone,
            isActive: link.isActive,
          }}
          submitLabel="Salvar alterações"
        />
      </div>
    </main>
  )
}

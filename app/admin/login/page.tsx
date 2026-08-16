import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LanguageSwitcher } from "@/components/findb/language-switcher"
import { BrandLogo } from "@/components/findb/brand-logo"
import { AdminLoginForm } from "@/components/findb/admin-login-form"
import { redirectAuthenticatedSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerCopy, getServerLang, type ServerLang } from "@/lib/server-copy"

export const dynamic = "force-dynamic"

const adminLoginCopy: Record<
  ServerLang,
  {
    eyebrow: string
    title: string
    createFirstAdmin: string
  }
> = {
  ptBr: {
    eyebrow: "FindB Europa",
    title: "Painel admin",
    createFirstAdmin: "Criar primeiro admin",
  },
  ptPt: {
    eyebrow: "FindB Europa",
    title: "Painel admin",
    createFirstAdmin: "Criar primeiro admin",
  },
  en: {
    eyebrow: "FindB Europa",
    title: "Admin panel",
    createFirstAdmin: "Create first admin",
  },
  es: {
    eyebrow: "FindB Europa",
    title: "Panel admin",
    createFirstAdmin: "Crear primer admin",
  },
  fr: {
    eyebrow: "FindB Europa",
    title: "Panel admin",
    createFirstAdmin: "Créer le premier admin",
  },
}

export default async function AdminLoginPage() {
  await redirectAuthenticatedSession()
  const [adminCount, c, lang] = await Promise.all([
    prisma.adminUser.count(),
    getServerCopy(),
    getServerLang(),
  ])
  const labels = adminLoginCopy[lang]

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {c.common.backToBio}
          </Link>
          <LanguageSwitcher align="right" />
        </div>

        <section className="relative flex flex-col items-center text-center">
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />
          <p className="relative z-10 mt-4 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {labels.eyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-primary text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            {labels.title}
          </h1>
        </section>

        <AdminLoginForm />

        {adminCount === 0 && (
          <Link href="/admin/setup" className="inline-flex min-h-11 items-center justify-center rounded-full bg-white/78 px-4 text-sm font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
            {labels.createFirstAdmin}
          </Link>
        )}
      </div>
    </main>
  )
}

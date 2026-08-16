import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AdminSetupForm } from "@/components/findb/admin-setup-form"
import { BrandLogo } from "@/components/findb/brand-logo"
import { redirectAuthenticatedSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AdminSetupPage() {
  await redirectAuthenticatedSession()
  const adminCount = await prisma.adminUser.count()

  if (adminCount > 0) {
    redirect("/admin/login")
  }

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <Link href="/admin/login" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar ao login
        </Link>

        <section className="relative flex flex-col items-center text-center">
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />
          <p className="relative z-10 mt-4 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            Segurança
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-primary text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            Configurar admin
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            Crie o primeiro acesso administrativo direto no banco PostgreSQL.
          </p>
        </section>

        <AdminSetupForm />
      </div>
    </main>
  )
}

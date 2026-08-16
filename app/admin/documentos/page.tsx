import Link from "next/link"
import { ArrowLeft, Download, Edit3, FileText, Plus, Send, ShieldCheck } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { DeleteDocumentDialog } from "@/components/findb/delete-document-dialog"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { ToastMessage } from "@/components/findb/toast-message"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerCopy } from "@/lib/server-copy"
import { getToastFromSearchParams } from "@/lib/toast"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminDocumentsPage({ searchParams }: PageProps) {
  await requireAdminSession()
  const c = await getServerCopy()
  const toast = await getToastFromSearchParams(searchParams)

  const documents = await prisma.contentAsset.findMany({
    orderBy: { createdAt: "desc" },
  })

  const regulations = documents.filter((document) => document.type === "REGULATION").length
  const materials = documents.filter((document) => ["MATERIAL", "STORY", "SCRIPT", "BRAND"].includes(document.type)).length
  const submissions = documents.filter((document) => document.type === "SUBMISSION").length

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
          <Link href="/admin/documentos/novo" className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-accent">
            <Plus className="size-4" aria-hidden="true" />
            {c.adminLists.newDocument}
          </Link>
        </div>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.adminLists.documentsEyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{c.adminLists.documentsTitleStart}</span>{" "}
            <span className="text-accent">{c.adminLists.documentsTitleAccent}</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {c.adminLists.documentsDescription}
          </p>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-3 sm:p-5">
          <Summary icon={FileText} label={c.adminLists.regulations} value={regulations} />
          <Summary icon={Download} label={c.adminLists.materials} value={materials} />
          <Summary icon={Send} label={c.adminLists.submissions} value={submissions} />
        </section>

        <section className="grid gap-2.5">
          {documents.length ? (
            documents.map((document) => (
              <article key={document.id} className="findb-link-card relative overflow-hidden rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:p-5">
                <span aria-hidden="true" className="findb-link-shine" />
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent min-[390px]:size-12">
                    <DocumentIcon type={document.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-primary ring-1 ring-primary/8">
                        {getDocumentTypeLabel(document.type, c.adminLists)}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-lg font-extrabold leading-tight text-primary">
                      {document.title}
                    </h2>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                      {document.description}
                    </p>
                    <p className="mt-2 break-words text-[11px] font-bold text-primary/75">
                      {document.url}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <a href={document.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:text-accent">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    {c.adminLists.open}
                  </a>
                  <Link href={`/admin/documentos/${document.id}/editar`} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-accent">
                    <Edit3 className="size-4" aria-hidden="true" />
                    {c.common.edit}
                  </Link>
                  <DeleteDocumentDialog
                    id={document.id}
                    title={document.title}
                    labels={{
                      trigger: c.common.delete,
                      title: c.adminLists.deleteDocumentTitle,
                      description: c.adminLists.deleteDocumentDescription,
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
              {c.adminLists.noDocuments}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Summary({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: number }) {
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

function DocumentIcon({ type }: { type: string }) {
  const Icon = type === "REGULATION" ? FileText : type === "SUBMISSION" ? Send : Download
  return <Icon className="size-5" aria-hidden="true" />
}

function getDocumentTypeLabel(
  type: string,
  labels: {
    documentRegulation: string
    documentMaterial: string
    documentSubmission: string
    documentStory: string
    documentScript: string
    documentBrand: string
    documentOther: string
    documentFallback: string
  },
) {
  const typeLabels: Record<string, string> = {
    REGULATION: labels.documentRegulation,
    MATERIAL: labels.documentMaterial,
    SUBMISSION: labels.documentSubmission,
    STORY: labels.documentStory,
    SCRIPT: labels.documentScript,
    BRAND: labels.documentBrand,
    OTHER: labels.documentOther,
  }

  return typeLabels[type] ?? labels.documentFallback
}

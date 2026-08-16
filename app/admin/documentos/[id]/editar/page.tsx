import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { updateDocument } from "@/app/admin/documentos/actions"
import { BrandLogo } from "@/components/findb/brand-logo"
import { DocumentForm } from "@/components/findb/document-form"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerCopy } from "@/lib/server-copy"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditDocumentPage({ params }: PageProps) {
  await requireAdminSession()
  const c = await getServerCopy()
  const { id } = await params
  const document = await prisma.contentAsset.findUnique({ where: { id } })

  if (!document) {
    notFound()
  }

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <Link href="/admin/documentos" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {c.adminLists.documentsBack}
        </Link>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {c.adminLists.editMaterial}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{c.adminLists.editDocumentTitleStart}</span>{" "}
            <span className="text-accent">{c.adminLists.editDocumentTitleAccent}</span>
          </h1>
        </section>

        <DocumentForm
          action={updateDocument.bind(null, document.id)}
          values={{
            title: document.title,
            description: document.description,
            type: document.type,
            url: document.url,
          }}
          submitLabel={c.adminLists.saveChanges}
          labels={documentFormLabels(c)}
        />
      </div>
    </main>
  )
}

function documentFormLabels(c: Awaited<ReturnType<typeof getServerCopy>>) {
  return {
    formTitle: c.adminLists.documentFormTitle,
    formDescription: c.adminLists.documentFormDescription,
    title: c.adminLists.title,
    description: c.adminLists.descriptionLabel,
    type: c.adminLists.type,
    documentUrl: c.adminLists.documentUrl,
    documentUrlHelper: c.adminLists.documentUrlHelper,
    saving: c.adminLists.saving,
    types: {
      regulation: c.adminLists.documentRegulation,
      material: c.adminLists.documentMaterialDownload,
      submission: c.adminLists.documentSubmission,
      story: c.adminLists.documentStory,
      script: c.adminLists.documentScript,
      brand: c.adminLists.documentBrand,
      other: c.adminLists.documentOther,
    },
  }
}

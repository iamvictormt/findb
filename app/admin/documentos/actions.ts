"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { toastRedirect } from "@/lib/toast"

export type DocumentFormState = {
  ok: boolean
  message: string
}

type DocumentPayload =
  | {
      data: {
        title: string
        description: string
        type: string
        url: string
      }
      error?: never
    }
  | {
      data?: never
      error: string
    }

const documentTypes = new Set(["REGULATION", "MATERIAL", "SUBMISSION", "STORY", "SCRIPT", "BRAND", "OTHER"])

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function getPayload(formData: FormData): DocumentPayload {
  const title = asText(formData, "title")
  const description = asText(formData, "description")
  const type = asText(formData, "type") || "MATERIAL"
  const url = asText(formData, "url")

  if (!title || !description || !url) {
    return { error: "documentInvalid" }
  }

  if (!documentTypes.has(type)) {
    return { error: "documentInvalidType" }
  }

  return {
    data: {
      title,
      description,
      type,
      url,
    },
  }
}

function revalidateDocumentViews() {
  revalidatePath("/admin")
  revalidatePath("/admin/documentos")
  revalidatePath("/influenciadores")
  revalidatePath("/influenciadores/minha-conta")
}

export async function createDocument(
  _prevState: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  await requireAdminSession()

  const payload = getPayload(formData)

  if ("error" in payload) {
    return { ok: false, message: payload.error ?? "documentInvalid" }
  }

  await prisma.contentAsset.create({ data: payload.data })

  revalidateDocumentViews()
  redirect(toastRedirect("/admin/documentos", "success", "documentCreated"))
}

export async function updateDocument(
  id: string,
  _prevState: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  await requireAdminSession()

  const payload = getPayload(formData)

  if ("error" in payload) {
    return { ok: false, message: payload.error ?? "documentInvalid" }
  }

  await prisma.contentAsset.update({
    where: { id },
    data: payload.data,
  })

  revalidateDocumentViews()
  redirect(toastRedirect("/admin/documentos", "success", "documentUpdated"))
}

export async function deleteDocument(id: string) {
  await requireAdminSession()

  await prisma.contentAsset.delete({ where: { id } })

  revalidateDocumentViews()
  redirect(toastRedirect("/admin/documentos", "success", "documentDeleted"))
}

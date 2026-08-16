"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { toastRedirect } from "@/lib/toast"

export type EarningFormState = {
  ok: boolean
  message: string
}

const earningStatuses = new Set(["PENDING", "AVAILABLE", "PAID", "CANCELED"])

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function balanceDelta(status: string, amountCents: number) {
  if (status === "PENDING") {
    return { pendingCents: amountCents, availableCents: 0 }
  }

  if (status === "AVAILABLE") {
    return { pendingCents: 0, availableCents: amountCents }
  }

  return { pendingCents: 0, availableCents: 0 }
}

function revalidateEarningViews() {
  revalidatePath("/admin")
  revalidatePath("/admin/ganhos")
  revalidatePath("/influenciadores/minha-conta")
}

export async function createEarning(
  _prevState: EarningFormState,
  formData: FormData,
): Promise<EarningFormState> {
  await requireAdminSession()

  const influencerId = asText(formData, "influencerId")
  const campaignId = asText(formData, "campaignId")
  const amountEuros = Number(asText(formData, "amountEuros"))
  const status = asText(formData, "status") || "PENDING"
  const description = asText(formData, "description")

  if (!influencerId || !description || !Number.isFinite(amountEuros) || amountEuros <= 0) {
    return {
      ok: false,
      message: "earningInvalid",
    }
  }

  if (!earningStatuses.has(status)) {
    return {
      ok: false,
      message: "invalidStatus",
    }
  }

  const amountCents = Math.round(amountEuros * 100)
  const delta = balanceDelta(status, amountCents)

  await prisma.$transaction([
    prisma.earning.create({
      data: {
        influencerId,
        campaignId: campaignId || null,
        amountCents,
        status,
        description,
      },
    }),
    prisma.influencerProfile.update({
      where: { id: influencerId },
      data: {
        pendingCents: { increment: delta.pendingCents },
        availableCents: { increment: delta.availableCents },
      },
    }),
  ])

  revalidateEarningViews()
  redirect(toastRedirect("/admin/ganhos", "success", "earningCreated"))
}

export async function deleteEarning(id: string) {
  await requireAdminSession()

  const earning = await prisma.earning.findUnique({
    where: { id },
  })

  if (!earning) {
    redirect(toastRedirect("/admin/ganhos", "error", "earningNotFound"))
  }

  const delta = balanceDelta(earning.status, earning.amountCents)

  await prisma.$transaction([
    prisma.earning.delete({
      where: { id },
    }),
    prisma.influencerProfile.update({
      where: { id: earning.influencerId },
      data: {
        pendingCents: { decrement: delta.pendingCents },
        availableCents: { decrement: delta.availableCents },
      },
    }),
  ])

  revalidateEarningViews()
  redirect(toastRedirect("/admin/ganhos", "success", "earningDeleted"))
}

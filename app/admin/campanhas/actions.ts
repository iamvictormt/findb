"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { toastRedirect } from "@/lib/toast"

export type CampaignFormState = {
  ok: boolean
  message: string
}

const campaignStatuses = new Set(["ACTIVE", "PAUSED", "ENDED", "DRAFT"])
const maxRewardEuros = 1_000_000

type CampaignPayload =
  | {
      data: {
        title: string
        description: string
        objective: string
        rewardCents: number
        materialType: string
        status: string
        startsAt: Date
        endsAt: Date | null
      }
      error?: never
    }
  | {
      data?: never
      error: string
    }

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function parseDate(value: string) {
  if (!value) {
    return null
  }

  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function getCampaignPayload(formData: FormData): CampaignPayload {
  const title = asText(formData, "title")
  const description = asText(formData, "description")
  const objective = asText(formData, "objective")
  const rewardEuros = Number(asText(formData, "rewardEuros"))
  const materialType = asText(formData, "materialType")
  const status = asText(formData, "status") || "ACTIVE"
  const startsAtInvalid = asText(formData, "startsAtInvalid") === "1"
  const endsAtInvalid = asText(formData, "endsAtInvalid") === "1"
  const startsAt = parseDate(asText(formData, "startsAt"))
  const endsAt = parseDate(asText(formData, "endsAt"))

  if (!title || !description || !objective || !materialType || !Number.isFinite(rewardEuros) || rewardEuros <= 0) {
    return {
      error: "campaignInvalid",
    }
  }

  if (rewardEuros > maxRewardEuros) {
    return {
      error: "campaignRewardTooHigh",
    }
  }

  if (!campaignStatuses.has(status)) {
    return {
      error: "invalidStatus",
    }
  }

  if (startsAtInvalid || !startsAt) {
    return {
      error: "invalidStartDate",
    }
  }

  if (endsAtInvalid) {
    return {
      error: "invalidEndDate",
    }
  }

  if (startsAt < startOfToday()) {
    return {
      error: "invalidStartDate",
    }
  }

  if (endsAt && endsAt < startsAt) {
    return {
      error: "invalidEndDate",
    }
  }

  return {
    data: {
      title,
      description,
      objective,
      rewardCents: Math.round(rewardEuros * 100),
      materialType,
      status,
      startsAt,
      endsAt,
    },
  }
}

function revalidateCampaignViews() {
  revalidatePath("/admin")
  revalidatePath("/admin/campanhas")
  revalidatePath("/influenciadores")
  revalidatePath("/influenciadores/minha-conta")
}

export async function createCampaign(
  _prevState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  await requireAdminSession()

  const payload = getCampaignPayload(formData)

  if ("error" in payload) {
    return {
      ok: false,
      message: payload.error ?? "campaignSaveError",
    }
  }

  await prisma.campaign.create({
    data: payload.data,
  })

  revalidateCampaignViews()
  redirect(toastRedirect("/admin/campanhas", "success", "campaignCreated"))
}

export async function updateCampaign(
  id: string,
  _prevState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  await requireAdminSession()

  const payload = getCampaignPayload(formData)

  if ("error" in payload) {
    return {
      ok: false,
      message: payload.error ?? "campaignSaveError",
    }
  }

  await prisma.campaign.update({
    where: { id },
    data: payload.data,
  })

  revalidateCampaignViews()
  redirect(toastRedirect("/admin/campanhas", "success", "campaignUpdated"))
}

export async function deleteCampaign(id: string) {
  await requireAdminSession()

  await prisma.campaign.delete({
    where: { id },
  })

  revalidateCampaignViews()
  redirect(toastRedirect("/admin/campanhas", "success", "campaignDeleted"))
}

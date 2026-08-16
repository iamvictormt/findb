"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { toastRedirect } from "@/lib/toast"

export type HomeLinkFormState = {
  ok: boolean
  message: string
}

type HomeLinkPayload =
  | {
      data: {
        title: string
        subtitle: string
        titlePtPt: string | null
        subtitlePtPt: string | null
        titleEn: string | null
        subtitleEn: string | null
        titleEs: string | null
        subtitleEs: string | null
        titleFr: string | null
        subtitleFr: string | null
        href: string
        icon: string
        tone: string
        isActive: boolean
      }
      error?: never
    }
  | {
      data?: never
      error: string
    }

const iconOptions = new Set([
  "BadgeEuro",
  "BriefcaseBusiness",
  "CalendarDays",
  "ChevronRight",
  "CreditCard",
  "Globe2",
  "Handshake",
  "MessageCircle",
  "Network",
  "Plane",
  "UsersRound",
])

const toneOptions = new Set(["blue", "pink", "cyan", "green", "gold"])

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function getPayload(formData: FormData): HomeLinkPayload {
  const title = asText(formData, "title")
  const subtitle = asText(formData, "subtitle")
  const titlePtPt = asText(formData, "titlePtPt")
  const subtitlePtPt = asText(formData, "subtitlePtPt")
  const titleEn = asText(formData, "titleEn")
  const subtitleEn = asText(formData, "subtitleEn")
  const titleEs = asText(formData, "titleEs")
  const subtitleEs = asText(formData, "subtitleEs")
  const titleFr = asText(formData, "titleFr")
  const subtitleFr = asText(formData, "subtitleFr")
  const href = asText(formData, "href")
  const icon = asText(formData, "icon") || "ChevronRight"
  const tone = asText(formData, "tone") || "blue"
  const isActive = formData.get("isActive") === "on"

  if (!title || !subtitle || !href) {
    return { error: "homeLinkInvalid" }
  }

  if (!iconOptions.has(icon)) {
    return { error: "homeLinkInvalidIcon" }
  }

  if (!toneOptions.has(tone)) {
    return { error: "homeLinkInvalidTone" }
  }

  return {
    data: {
      title,
      subtitle,
      titlePtPt: titlePtPt || null,
      subtitlePtPt: subtitlePtPt || null,
      titleEn: titleEn || null,
      subtitleEn: subtitleEn || null,
      titleEs: titleEs || null,
      subtitleEs: subtitleEs || null,
      titleFr: titleFr || null,
      subtitleFr: subtitleFr || null,
      href,
      icon,
      tone,
      isActive,
    },
  }
}

function revalidateHomeLinks() {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/links")
}

export async function createHomeLink(
  _prevState: HomeLinkFormState,
  formData: FormData,
): Promise<HomeLinkFormState> {
  await requireAdminSession()

  const payload = getPayload(formData)

  if ("error" in payload) {
    return { ok: false, message: payload.error ?? "homeLinkInvalid" }
  }

  const lastLink = await prisma.homeLink.findFirst({
    orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
    select: { sortOrder: true },
  })

  await prisma.homeLink.create({
    data: {
      ...payload.data,
      sortOrder: (lastLink?.sortOrder ?? 0) + 10,
    },
  })

  revalidateHomeLinks()
  redirect(toastRedirect("/admin/links", "success", "homeLinkCreated"))
}

export async function updateHomeLink(
  id: string,
  _prevState: HomeLinkFormState,
  formData: FormData,
): Promise<HomeLinkFormState> {
  await requireAdminSession()

  const payload = getPayload(formData)

  if ("error" in payload) {
    return { ok: false, message: payload.error ?? "homeLinkInvalid" }
  }

  await prisma.homeLink.update({
    where: { id },
    data: payload.data,
  })

  revalidateHomeLinks()
  redirect(toastRedirect("/admin/links", "success", "homeLinkUpdated"))
}

export async function deleteHomeLink(id: string) {
  await requireAdminSession()

  await prisma.homeLink.delete({ where: { id } })

  revalidateHomeLinks()
  redirect(toastRedirect("/admin/links", "success", "homeLinkDeleted"))
}

export async function moveHomeLink(id: string, direction: "up" | "down") {
  await requireAdminSession()

  const links = await prisma.homeLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  })
  const currentIndex = links.findIndex((link) => link.id === id)
  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= links.length) {
    return
  }

  const current = links[currentIndex]
  const next = links[nextIndex]

  await prisma.$transaction([
    prisma.homeLink.update({ where: { id: current.id }, data: { sortOrder: next.sortOrder } }),
    prisma.homeLink.update({ where: { id: next.id }, data: { sortOrder: current.sortOrder } }),
  ])

  revalidateHomeLinks()
}

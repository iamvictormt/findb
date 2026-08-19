"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { Prisma } from "@prisma/client"
import { setSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { makeReferralUrlFromHeaders } from "@/lib/influencer-program"

export type InfluencerSignupState = {
  ok: boolean
  message: string
  profileUrl?: string
  referralUrl?: string
  values?: InfluencerSignupValues
  submittedAt?: number
}

export type InfluencerSignupValues = {
  name: string
  email: string
  whatsapp: string
  country: string
  otherCountry: string
  city: string
  slotId: string
  primaryNetwork: string
  socialHandle: string
  motivation: string
  audienceSize: string
  categories: string[]
  otherProfession: string
  languages: string[]
}

const initialError: InfluencerSignupState = {
  ok: false,
  message: "influencerSignupError",
}

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function makeSlug(name: string) {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42)

  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base || "influencer"}-${suffix}`
}

function makeReferralCode() {
  return `FINDB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function registerInfluencer(
  _prevState: InfluencerSignupState,
  formData: FormData,
): Promise<InfluencerSignupState> {
  const requestHeaders = await headers()
  const name = asText(formData, "name")
  const email = asText(formData, "email").toLowerCase()
  const whatsapp = asText(formData, "whatsapp").replace(/\D/g, "")
  const countrySelection = asText(formData, "country")
  const otherCountry = asText(formData, "otherCountry")
  const country = countrySelection === "Outro país europeu" ? otherCountry : countrySelection
  const city = asText(formData, "city")
  const slotId = asText(formData, "slotId")
  const primaryNetwork = asText(formData, "primaryNetwork")
  const socialHandle = asText(formData, "socialHandle")
  const motivation = asText(formData, "motivation")
  const audienceSize = Number(asText(formData, "audienceSize") || "0")
  const selectedCategories = formData.getAll("categories").filter(Boolean).map(String)
  const otherProfession = asText(formData, "otherProfession")
  const categories = selectedCategories
    .map((category) => (category === "Outras profissões" && otherProfession ? `Outras profissões: ${otherProfession}` : category))
    .join(", ")
  const selectedLanguages = formData.getAll("languages").filter(Boolean).map(String)
  const languages = selectedLanguages.join(", ")
  const values: InfluencerSignupValues = {
    name,
    email,
    whatsapp,
    country: countrySelection,
    otherCountry,
    city,
    slotId,
    primaryNetwork,
    socialHandle,
    motivation,
    audienceSize: asText(formData, "audienceSize"),
    categories: selectedCategories,
    otherProfession,
    languages: selectedLanguages,
  }
  const fail = (message: string): InfluencerSignupState => ({
    ok: false,
    message,
    values,
    submittedAt: Date.now(),
  })

  if (!name || !email || !whatsapp || !country || !primaryNetwork || !socialHandle || !slotId) {
    return fail(initialError.message)
  }

  if (!isValidEmail(email)) {
    return fail("influencerInvalidEmail")
  }

  if (whatsapp.length < 8 || whatsapp.length > 15) {
    return fail("influencerInvalidWhatsapp")
  }

  if (!selectedCategories.length) {
    return fail("influencerCategoryRequired")
  }

  if (selectedCategories.includes("Outras profissões") && !otherProfession) {
    return fail("influencerOtherProfessionRequired")
  }

  if (!selectedLanguages.length) {
    return fail("influencerLanguageRequired")
  }

  const existing = await prisma.influencerProfile.findUnique({ where: { email } })

  if (existing) {
    return fail("influencerEmailExists")
  }

  const slot = await prisma.meetingSlot.findUnique({
    where: { id: slotId },
    include: { booking: true },
  })

  if (!slot || !slot.isActive || slot.startsAt <= new Date() || slot.booking) {
    return fail("meetingSlotUnavailable")
  }

  let profile: Awaited<ReturnType<typeof prisma.influencerProfile.create>>

  try {
    profile = await prisma.$transaction(async (tx) => {
      const createdProfile = await tx.influencerProfile.create({
        data: {
          name,
          email,
          whatsapp,
          country,
          city,
          primaryNetwork,
          socialHandle,
          audienceSize: Number.isFinite(audienceSize) ? audienceSize : null,
          categories: categories || "Comunidade imigrante",
          languages: languages || "Português",
          motivation,
          referralSlug: makeSlug(name),
          referralCode: makeReferralCode(),
        },
      })

      await tx.partnershipMeeting.create({
        data: {
          slotId,
          name,
          email,
          whatsapp,
          country,
          message: motivation || "Cadastro de influenciador",
        },
      })

      return createdProfile
    })
  } catch (caught) {
    if (caught instanceof Prisma.PrismaClientKnownRequestError && caught.code === "P2002") {
      return {
        ok: false,
        message: caught.meta?.target === "PartnershipMeeting_slotId_key" ? "meetingSlotUnavailable" : "influencerEmailExists",
        values,
        submittedAt: Date.now(),
      }
    }

    return fail("meetingSlotUnavailable")
  }

  await setSession({
    role: "INFLUENCER",
    influencerId: profile.id,
    email: profile.email,
  })

  revalidatePath("/influenciadores")
  revalidatePath("/admin/agendamentos")

  return {
    ok: true,
    message: "influencerSignupSuccess",
    referralUrl: makeReferralUrlFromHeaders(profile.referralSlug, requestHeaders),
  }
}

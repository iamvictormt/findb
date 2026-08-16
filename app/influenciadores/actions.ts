"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { setSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { makeReferralUrlFromHeaders } from "@/lib/influencer-program"

export type InfluencerSignupState = {
  ok: boolean
  message: string
  profileUrl?: string
  referralUrl?: string
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
  const primaryNetwork = asText(formData, "primaryNetwork")
  const socialHandle = asText(formData, "socialHandle")
  const motivation = asText(formData, "motivation")
  const audienceSize = Number(asText(formData, "audienceSize") || "0")
  const selectedCategories = formData.getAll("categories").filter(Boolean).map(String)
  const otherProfession = asText(formData, "otherProfession")
  const categories = selectedCategories
    .map((category) => (category === "Outras profissões" && otherProfession ? `Outras profissões: ${otherProfession}` : category))
    .join(", ")
  const languages = formData.getAll("languages").filter(Boolean).join(", ")

  if (!name || !email || !whatsapp || !country || !primaryNetwork || !socialHandle) {
    return initialError
  }

  if (selectedCategories.includes("Outras profissões") && !otherProfession) {
    return initialError
  }

  const existing = await prisma.influencerProfile.findUnique({ where: { email } })

  if (existing) {
    await setSession({
      role: "INFLUENCER",
      influencerId: existing.id,
      email: existing.email,
    })

    return {
      ok: true,
      message: "influencerAlreadyExists",
      profileUrl: "/influenciadores/minha-conta",
      referralUrl: makeReferralUrlFromHeaders(existing.referralSlug, requestHeaders),
    }
  }

  const profile = await prisma.influencerProfile.create({
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

  await setSession({
    role: "INFLUENCER",
    influencerId: profile.id,
    email: profile.email,
  })

  revalidatePath("/influenciadores")

  return {
    ok: true,
    message: "influencerSignupSuccess",
    profileUrl: "/influenciadores/minha-conta",
    referralUrl: makeReferralUrlFromHeaders(profile.referralSlug, requestHeaders),
  }
}

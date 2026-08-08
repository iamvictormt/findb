"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { makeReferralUrl } from "@/lib/influencer-program"

export type InfluencerSignupState = {
  ok: boolean
  message: string
  profileUrl?: string
  referralUrl?: string
}

const initialError: InfluencerSignupState = {
  ok: false,
  message: "Não foi possível concluir o cadastro. Confira os campos e tente novamente.",
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
  const name = asText(formData, "name")
  const email = asText(formData, "email").toLowerCase()
  const whatsapp = asText(formData, "whatsapp")
  const country = asText(formData, "country")
  const city = asText(formData, "city")
  const primaryNetwork = asText(formData, "primaryNetwork")
  const socialHandle = asText(formData, "socialHandle")
  const motivation = asText(formData, "motivation")
  const audienceSize = Number(asText(formData, "audienceSize") || "0")
  const categories = formData.getAll("categories").filter(Boolean).join(", ")
  const languages = formData.getAll("languages").filter(Boolean).join(", ")

  if (!name || !email || !whatsapp || !country || !primaryNetwork || !socialHandle) {
    return initialError
  }

  const existing = await prisma.influencerProfile.findUnique({ where: { email } })

  if (existing) {
    return {
      ok: true,
      message: "Você já tem um cadastro no programa. Abrimos seu painel novamente.",
      profileUrl: `/influenciadores/painel/${existing.referralSlug}`,
      referralUrl: makeReferralUrl(existing.referralSlug),
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

  revalidatePath("/influenciadores")

  return {
    ok: true,
    message: "Cadastro recebido. Seu painel já está pronto enquanto a equipe avalia sua aprovação.",
    profileUrl: `/influenciadores/painel/${profile.referralSlug}`,
    referralUrl: makeReferralUrl(profile.referralSlug),
  }
}

"use server"

import { redirect } from "next/navigation"
import { setSession } from "@/lib/auth"
import { sendMail } from "@/lib/email"
import { LOGIN_CODE_TTL_MINUTES, loginCodeEmailHtml, loginCodeEmailSubject, loginCodeEmailText } from "@/lib/login-email-template"
import { generateLoginCode, hashLoginCode, normalizeLoginCode } from "@/lib/login-code"
import { prisma } from "@/lib/prisma"

export type InfluencerLoginState = {
  ok: boolean
  message: string
  step: "email" | "code"
  email: string
}

const RESEND_SECONDS = 60
const MAX_ATTEMPTS = 5

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function loginInfluencer(
  _prevState: InfluencerLoginState,
  formData: FormData,
): Promise<InfluencerLoginState> {
  const intents = formData.getAll("intent")
  const lastIntent = intents.at(-1)
  const intent = typeof lastIntent === "string" && lastIntent ? lastIntent : "request-code"
  const email = asText(formData, "email").toLowerCase()

  if (intent === "change-email") {
    return { ok: false, message: "", step: "email", email: "" }
  }

  if (!email) {
    return { ok: false, message: "influencerLoginEmailRequired", step: "email", email }
  }

  const profile = await prisma.influencerProfile.findUnique({ where: { email } })

  if (!profile) {
    return { ok: false, message: "influencerLoginNotFound", step: "email", email }
  }

  if (profile.status !== "APPROVED") {
    return { ok: false, message: "influencerLoginPendingApproval", step: "email", email }
  }

  if (intent === "verify-code") {
    return verifyCode(profile.id, profile.email, email, asText(formData, "code"))
  }

  return requestCode(profile.id, profile.email, email)
}

async function requestCode(influencerId: string, profileEmail: string, email: string): Promise<InfluencerLoginState> {
  const recentCode = await prisma.influencerLoginCode.findFirst({
    where: {
      influencerId,
      email,
      consumedAt: null,
      createdAt: { gt: new Date(Date.now() - RESEND_SECONDS * 1000) },
    },
    orderBy: { createdAt: "desc" },
  })

  if (recentCode) {
    return { ok: false, message: "influencerLoginCodeRecentlySent", step: "code", email }
  }

  const code = generateLoginCode()
  await prisma.influencerLoginCode.create({
    data: {
      influencerId,
      email,
      codeHash: hashLoginCode(code),
      expiresAt: new Date(Date.now() + LOGIN_CODE_TTL_MINUTES * 60 * 1000),
    },
  })

  try {
    const result = await sendMail({
      to: profileEmail,
      subject: loginCodeEmailSubject(),
      text: loginCodeEmailText({ code }),
      html: loginCodeEmailHtml({ code }),
    })

    return {
      ok: true,
      message: result.sent ? "influencerLoginCodeSent" : "influencerLoginCodeDevSent",
      step: "code",
      email,
    }
  } catch (error) {
    console.error(error)
    return { ok: false, message: "influencerLoginCodeSendError", step: "email", email }
  }
}

async function verifyCode(
  influencerId: string,
  profileEmail: string,
  email: string,
  rawCode: string,
): Promise<InfluencerLoginState> {
  const code = normalizeLoginCode(rawCode)

  if (code.length !== 6) {
    return { ok: false, message: "influencerLoginCodeRequired", step: "code", email }
  }

  const loginCode = await prisma.influencerLoginCode.findFirst({
    where: {
      influencerId,
      email,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  })

  if (!loginCode || loginCode.expiresAt < new Date()) {
    return { ok: false, message: "influencerLoginCodeExpired", step: "email", email }
  }

  if (loginCode.attempts >= MAX_ATTEMPTS) {
    return { ok: false, message: "influencerLoginCodeBlocked", step: "email", email }
  }

  if (loginCode.codeHash !== hashLoginCode(code)) {
    await prisma.influencerLoginCode.update({
      where: { id: loginCode.id },
      data: { attempts: { increment: 1 } },
    })

    return { ok: false, message: "influencerLoginCodeInvalid", step: "code", email }
  }

  const profile = await prisma.influencerProfile.findUnique({
    where: { id: influencerId },
    select: { status: true },
  })

  if (profile?.status !== "APPROVED") {
    return { ok: false, message: "influencerLoginPendingApproval", step: "email", email }
  }

  await prisma.influencerLoginCode.update({
    where: { id: loginCode.id },
    data: { consumedAt: new Date() },
  })

  await setSession({
    role: "INFLUENCER",
    influencerId,
    email: profileEmail,
  })

  redirect("/influenciadores/minha-conta")
}

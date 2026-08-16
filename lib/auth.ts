import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export type SessionRole = "ADMIN" | "INFLUENCER"

export type AuthSession = {
  role: SessionRole
  adminId?: string
  influencerId?: string
  email: string
  expiresAt?: number
}

const COOKIE_NAME = "findb-session"
const SESSION_MAX_AGE_SECONDS = 45 * 60

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "findb-dev-secret-change-me"
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url")
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url")
}

function createToken(session: AuthSession) {
  const payload = encodeBase64Url(JSON.stringify(session))
  return `${payload}.${sign(payload)}`
}

function parseToken(token?: string): AuthSession | null {
  if (!token) {
    return null
  }

  const [payload, signature] = token.split(".")

  if (!payload || !signature) {
    return null
  }

  const expected = sign(payload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const session = JSON.parse(decodeBase64Url(payload)) as AuthSession

    if (typeof session.expiresAt !== "number" || session.expiresAt <= Date.now()) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function setSession(session: AuthSession) {
  const cookieStore = await cookies()
  const sessionWithExpiry: AuthSession = {
    ...session,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  }

  cookieStore.set(COOKIE_NAME, createToken(sessionWithExpiry), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession() {
  const cookieStore = await cookies()
  return parseToken(cookieStore.get(COOKIE_NAME)?.value)
}

export async function requireAdminSession() {
  const session = await getSession()

  if (session?.role !== "ADMIN" || !session.adminId) {
    redirect("/admin/login")
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminId },
  })

  if (!admin || admin.status !== "ACTIVE") {
    redirect("/admin/login")
  }

  return { session, admin }
}

export async function requireInfluencerSession() {
  const session = await getSession()

  if (session?.role !== "INFLUENCER" || !session.influencerId) {
    redirect("/influenciadores/entrar")
  }

  const profile = await prisma.influencerProfile.findUnique({
    where: { id: session.influencerId },
  })

  if (!profile || profile.status !== "APPROVED") {
    redirect("/influenciadores/entrar")
  }

  return { session, profile }
}

export async function redirectAuthenticatedSession() {
  const session = await getSession()

  if (session?.role === "ADMIN" && session.adminId) {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.adminId },
      select: { status: true },
    })

    if (admin?.status === "ACTIVE") {
      redirect("/admin")
    }
  }

  if (session?.role === "INFLUENCER" && session.influencerId) {
    const profile = await prisma.influencerProfile.findUnique({
      where: { id: session.influencerId },
      select: { status: true },
    })

    if (profile?.status === "APPROVED") {
      redirect("/influenciadores/minha-conta")
    }
  }
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "")
}

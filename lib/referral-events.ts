import { createHash } from "node:crypto"
import { prisma } from "@/lib/prisma"

type ReferralEventInput = {
  influencerId: string
  type: string
  source?: string | null
  headers: Headers
}

export async function recordReferralEvent({
  influencerId,
  type,
  source,
  headers,
}: ReferralEventInput) {
  const normalizedSource = source || null
  const metadata = getVisitorMetadata(headers)

  if (type === "CLICK") {
    const existingClick = await prisma.referralEvent.findFirst({
      where: {
        influencerId,
        type,
        source: normalizedSource,
        metadata,
      },
      select: { id: true },
    })

    if (existingClick) {
      return { created: false }
    }
  }

  await prisma.referralEvent.create({
    data: {
      influencerId,
      type,
      source: normalizedSource,
      metadata,
    },
  })

  return { created: true }
}

export async function getReferralMetrics(influencerId: string) {
  const [clickEvents, shares, conversions] = await Promise.all([
    prisma.referralEvent.findMany({
      where: {
        influencerId,
        type: "CLICK",
      },
      select: {
        id: true,
        metadata: true,
      },
    }),
    prisma.referralEvent.count({
      where: {
        influencerId,
        type: "SHARE",
      },
    }),
    prisma.referralEvent.count({
      where: {
        influencerId,
        type: "SIGNUP",
      },
    }),
  ])

  const uniqueClickKeys = new Set(clickEvents.map((event) => event.metadata || event.id))

  return {
    clicks: uniqueClickKeys.size,
    shares,
    conversions,
  }
}

function getVisitorMetadata(headers: Headers) {
  const ip = getClientIp(headers)
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 32)

  return `ip:${ipHash}`
}

function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for")
  const forwardedIp = forwardedFor?.split(",").at(0)?.trim()

  return (
    forwardedIp ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-client-ip") ||
    "unknown"
  )
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { recordReferralEvent } from "@/lib/referral-events"

const allowedTypes = new Set(["CLICK", "SHARE", "SIGNUP", "VIEW"])

type EventRouteContext = { params: Promise<{ slug: string }> }

export async function GET(request: Request, context: EventRouteContext) {
  return recordEvent(request, context)
}

export async function POST(request: Request, context: EventRouteContext) {
  return recordEvent(request, context)
}

async function recordEvent(request: Request, context: EventRouteContext) {
  const { slug } = await context.params
  const url = new URL(request.url)
  const type = url.searchParams.get("type")?.toUpperCase() ?? "VIEW"

  if (!allowedTypes.has(type)) {
    return NextResponse.json({ ok: false, message: "Tipo de evento invalido." }, { status: 400 })
  }

  const profile = await prisma.influencerProfile.findUnique({
    where: { referralSlug: slug },
    select: { id: true },
  })

  if (!profile) {
    return NextResponse.json({ ok: false, message: "Influenciador nao encontrado." }, { status: 404 })
  }

  const result = await recordReferralEvent({
    influencerId: profile.id,
    type,
    source: url.searchParams.get("source"),
    headers: request.headers,
  })

  return NextResponse.json({ ok: true, created: result.created })
}

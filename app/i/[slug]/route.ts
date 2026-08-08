import { redirect } from "next/navigation"
import { siteUrl } from "@/lib/findb-data"
import { prisma } from "@/lib/prisma"

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const profile = await prisma.influencerProfile.findUnique({
    where: { referralSlug: slug },
    select: { id: true },
  })

  if (profile) {
    await prisma.referralEvent.create({
      data: {
        influencerId: profile.id,
        type: "CLICK",
        source: "referral-link",
      },
    })
  }

  redirect(siteUrl.href)
}

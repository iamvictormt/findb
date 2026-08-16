"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { toastRedirect } from "@/lib/toast"

export async function updateInfluencerStatus(id: string, status: "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING") {
  await requireAdminSession()

  await prisma.influencerProfile.update({
    where: { id },
    data: { status },
  })

  revalidatePath("/admin")
  revalidatePath("/admin/influenciadores")
  redirect(toastRedirect("/admin/influenciadores", "success", "influencerStatusUpdated"))
}

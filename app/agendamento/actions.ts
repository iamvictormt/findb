"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { normalizePhone } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { toastRedirect } from "@/lib/toast"

export type BookingFormState = {
  ok: boolean
  message: string
}

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function createPartnershipMeeting(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const slotId = asText(formData, "slotId")
  const name = asText(formData, "name")
  const email = asText(formData, "email").toLowerCase()
  const whatsapp = asText(formData, "whatsapp")
  const country = asText(formData, "country")
  const company = asText(formData, "company")
  const message = asText(formData, "message")

  if (!slotId || !name || !email || !whatsapp || !country || !isValidEmail(email)) {
    return { ok: false, message: "meetingInvalid" }
  }

  const phone = normalizePhone(whatsapp)

  if (phone.length < 8) {
    return { ok: false, message: "meetingInvalid" }
  }

  const slot = await prisma.meetingSlot.findUnique({
    where: { id: slotId },
    include: { booking: true },
  })

  if (!slot || !slot.isActive || slot.startsAt <= new Date() || slot.booking) {
    return { ok: false, message: "meetingSlotUnavailable" }
  }

  try {
    await prisma.partnershipMeeting.create({
      data: {
        slotId,
        name,
        email,
        whatsapp,
        country,
        company: company || null,
        message: message || null,
      },
    })
  } catch {
    return { ok: false, message: "meetingSlotUnavailable" }
  }

  revalidatePath("/agendamento")
  revalidatePath("/admin/agendamentos")
  redirect(toastRedirect("/agendamento", "success", "meetingBooked"))
}

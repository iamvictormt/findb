"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseLocalDateTime } from "@/lib/scheduling"
import { toastRedirect } from "@/lib/toast"

export type MeetingSlotFormState = {
  ok: boolean
  message: string
}

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function revalidateScheduling() {
  revalidatePath("/agendamento")
  revalidatePath("/admin")
  revalidatePath("/admin/agendamentos")
}

export async function createMeetingSlot(
  _prevState: MeetingSlotFormState,
  formData: FormData,
): Promise<MeetingSlotFormState> {
  await requireAdminSession()

  const date = asText(formData, "date")
  const time = asText(formData, "time")
  const duration = Number(asText(formData, "durationMinutes") || "30")
  const note = asText(formData, "note")
  const startsAt = parseLocalDateTime(date, time)

  if (!startsAt || !Number.isInteger(duration) || duration < 15 || duration > 180) {
    return { ok: false, message: "meetingSlotInvalid" }
  }

  if (startsAt <= new Date()) {
    return { ok: false, message: "meetingSlotPast" }
  }

  const endsAt = new Date(startsAt.getTime() + duration * 60_000)

  try {
    await prisma.meetingSlot.create({
      data: {
        startsAt,
        endsAt,
        note: note || null,
      },
    })
  } catch {
    return { ok: false, message: "meetingSlotDuplicate" }
  }

  revalidateScheduling()
  redirect(toastRedirect("/admin/agendamentos", "success", "meetingSlotCreated"))
}

export async function toggleMeetingSlot(id: string) {
  await requireAdminSession()

  const slot = await prisma.meetingSlot.findUnique({
    where: { id },
    select: { isActive: true, booking: { select: { id: true } } },
  })

  if (!slot || slot.booking) {
    return
  }

  const nextActive = !slot.isActive

  await prisma.meetingSlot.update({
    where: { id },
    data: { isActive: nextActive },
  })

  revalidateScheduling()
  redirect(toastRedirect("/admin/agendamentos", "success", nextActive ? "meetingSlotActivated" : "meetingSlotDeactivated"))
}

export async function deleteMeetingSlot(id: string) {
  await requireAdminSession()

  const slot = await prisma.meetingSlot.findUnique({
    where: { id },
    select: { booking: { select: { id: true } } },
  })

  if (!slot || slot.booking) {
    return
  }

  await prisma.meetingSlot.delete({ where: { id } })

  revalidateScheduling()
  redirect(toastRedirect("/admin/agendamentos", "success", "meetingSlotDeleted"))
}

export async function cancelPartnershipMeeting(id: string) {
  await requireAdminSession()

  await prisma.partnershipMeeting.update({
    where: { id },
    data: { status: "CANCELED" },
  })

  revalidateScheduling()
  redirect(toastRedirect("/admin/agendamentos", "success", "meetingCanceled"))
}

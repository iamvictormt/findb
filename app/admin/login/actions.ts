"use server"

import { redirect } from "next/navigation"
import { setSession } from "@/lib/auth"
import { verifyPassword } from "@/lib/password"
import { prisma } from "@/lib/prisma"

export type AdminLoginState = {
  ok: boolean
  message: string
}

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function loginAdmin(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = asText(formData, "email").toLowerCase()
  const password = asText(formData, "password")

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  })

  if (!admin || admin.status !== "ACTIVE") {
    return {
      ok: false,
      message: "invalidCredentials",
    }
  }

  const passwordMatches = await verifyPassword(password, admin.passwordHash)

  if (!passwordMatches) {
    return {
      ok: false,
      message: "invalidCredentials",
    }
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  })

  await setSession({
    role: "ADMIN",
    adminId: admin.id,
    email: admin.email,
  })

  redirect("/admin")
}

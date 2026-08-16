"use server"

import { redirect } from "next/navigation"
import { setSession } from "@/lib/auth"
import { hashPassword } from "@/lib/password"
import { prisma } from "@/lib/prisma"

export type AdminSetupState = {
  ok: boolean
  message: string
}

function asText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function createFirstAdmin(
  _prevState: AdminSetupState,
  formData: FormData,
): Promise<AdminSetupState> {
  const existingAdmins = await prisma.adminUser.count()

  if (existingAdmins > 0) {
    return {
      ok: false,
      message: "firstAdminExists",
    }
  }

  const name = asText(formData, "name")
  const email = asText(formData, "email").toLowerCase()
  const password = asText(formData, "password")
  const confirmPassword = asText(formData, "confirmPassword")

  if (!name || !email || !password || !confirmPassword) {
    return {
      ok: false,
      message: "fillAllFields",
    }
  }

  if (password.length < 8) {
    return {
      ok: false,
      message: "passwordTooShort",
    }
  }

  if (password !== confirmPassword) {
    return {
      ok: false,
      message: "passwordsDoNotMatch",
    }
  }

  const admin = await prisma.adminUser.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
    },
  })

  await setSession({
    role: "ADMIN",
    adminId: admin.id,
    email: admin.email,
  })

  redirect("/admin")
}

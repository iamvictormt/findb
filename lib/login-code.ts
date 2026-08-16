import "server-only"

import { createHash, randomInt } from "node:crypto"

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateLoginCode() {
  let code = ""

  for (let index = 0; index < 6; index += 1) {
    code += alphabet[randomInt(alphabet.length)]
  }

  return code
}

export function normalizeLoginCode(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6)
}

export function hashLoginCode(code: string) {
  return createHash("sha256")
    .update(`${process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "findb-dev-secret-change-me"}:${normalizeLoginCode(code)}`)
    .digest("hex")
}

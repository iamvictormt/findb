import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(scryptCallback)
const KEY_LENGTH = 64
const PREFIX = "scrypt"

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url")
  const hash = (await scrypt(password, salt, KEY_LENGTH)) as Buffer

  return `${PREFIX}:${salt}:${hash.toString("base64url")}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [prefix, salt, hash] = storedHash.split(":")

  if (prefix !== PREFIX || !salt || !hash) {
    return false
  }

  const hashBuffer = Buffer.from(hash, "base64url")
  const passwordHash = (await scrypt(password, salt, hashBuffer.length)) as Buffer

  return hashBuffer.length === passwordHash.length && timingSafeEqual(hashBuffer, passwordHash)
}

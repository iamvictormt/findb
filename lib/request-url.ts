export function getRequestOrigin(headers: Pick<Headers, "get">) {
  const host = headers.get("x-forwarded-host") || headers.get("host")

  if (!host) {
    return undefined
  }

  const protocol = headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https")
  return `${protocol}://${host}`
}

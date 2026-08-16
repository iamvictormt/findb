export type ToastType = "success" | "error"

export function toastRedirect(path: string, type: ToastType, message: string) {
  const params = new URLSearchParams({
    toast: type,
    message,
  })

  return `${path}?${params.toString()}`
}

export async function getToastFromSearchParams(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
): Promise<{ type: ToastType; message: string } | null> {
  const params = await searchParams
  const toast = typeof params.toast === "string" ? params.toast : ""
  const message = typeof params.message === "string" ? params.message : ""

  if ((toast === "success" || toast === "error") && message) {
    return {
      type: toast,
      message,
    }
  }

  return null
}

export const meetingStatuses = {
  CONFIRMED: "Confirmada",
  CANCELED: "Cancelada",
} as const

export function formatDateLong(date: Date, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatDateShort(date: Date, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function formatTime(date: Date, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatMeetingRange(startsAt: Date, endsAt: Date, locale = "pt-BR", rangeSeparator = "as") {
  return `${formatDateShort(startsAt, locale)} - ${formatTime(startsAt, locale)} ${rangeSeparator} ${formatTime(endsAt, locale)}`
}

export function parseLocalDateTime(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return null
  }

  const [year, month, day] = date.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  const parsed = new Date(year, month - 1, day, hour, minute)

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute
  ) {
    return null
  }

  return parsed
}

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

export function formatLisbonDateLong(date: Date, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Lisbon",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatLisbonDateShort(date: Date, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function formatLisbonTime(date: Date, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatLisbonMeetingRange(startsAt: Date, endsAt: Date, locale = "pt-BR", rangeSeparator = "as") {
  return `${formatLisbonDateShort(startsAt, locale)} - ${formatLisbonTime(startsAt, locale)} ${rangeSeparator} ${formatLisbonTime(endsAt, locale)}`
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

export function parseLisbonDateTime(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return null
  }

  const [year, month, day] = date.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  const parsed = zonedDateTimeToUtc(year, month, day, hour, minute, "Europe/Lisbon")

  if (
    formatZonedPart(parsed, "Europe/Lisbon", "year") !== String(year) ||
    formatZonedPart(parsed, "Europe/Lisbon", "month") !== String(month).padStart(2, "0") ||
    formatZonedPart(parsed, "Europe/Lisbon", "day") !== String(day).padStart(2, "0") ||
    formatZonedPart(parsed, "Europe/Lisbon", "hour") !== String(hour).padStart(2, "0") ||
    formatZonedPart(parsed, "Europe/Lisbon", "minute") !== String(minute).padStart(2, "0")
  ) {
    return null
  }

  return parsed
}

function zonedDateTimeToUtc(year: number, month: number, day: number, hour: number, minute: number, timeZone: string) {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute)
  let result = new Date(utcGuess)

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const offset = getTimeZoneOffsetMs(result, timeZone)
    result = new Date(utcGuess - offset)
  }

  return result
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = getZonedParts(date, timeZone)
  const zonedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )

  return zonedAsUtc - date.getTime()
}

function formatZonedPart(date: Date, timeZone: string, type: Intl.DateTimeFormatPartTypes) {
  return getZonedParts(date, timeZone)[type] ?? ""
}

function getZonedParts(date: Date, timeZone: string) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).map((part) => [part.type, part.value]),
  )
}

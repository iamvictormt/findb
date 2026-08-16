import "server-only"

import nodemailer from "nodemailer"

type MailPayload = {
  to: string
  subject: string
  text: string
  html: string
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM ?? user

  if (!host || !user || !pass || !from) {
    return null
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from,
  }
}

export async function sendMail({ to, subject, text, html }: MailPayload) {
  const config = getSmtpConfig()

  if (!config) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email skipped] Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and SMTP_FROM.")
      console.info({ to, subject, text })
    }

    return { sent: false }
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  })

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    text,
    html,
  })

  return { sent: true }
}

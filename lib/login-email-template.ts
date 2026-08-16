import "server-only"

export const LOGIN_CODE_TTL_MINUTES = 10

type LoginCodeEmailInput = {
  code: string
  minutes?: number
  logoUrl?: string
}

export function loginCodeEmailSubject() {
  return "Seu código de acesso FindB Europa"
}

export function loginCodeEmailText({ code, minutes = LOGIN_CODE_TTL_MINUTES }: LoginCodeEmailInput) {
  return [
    "FindB Europa",
    "",
    `Seu código de acesso é ${code}.`,
    `Ele vence em ${minutes} minutos.`,
    "",
    "Se você não solicitou este acesso, ignore este email.",
  ].join("\n")
}

function getDefaultLogoUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://findbeuropa.com"
  return `${baseUrl.replace(/\/$/, "")}/images/logo-completa.png`
}

export function loginCodeEmailHtml({ code, minutes = LOGIN_CODE_TTL_MINUTES, logoUrl = getDefaultLogoUrl() }: LoginCodeEmailInput) {
  const codeDigits = code.split("")

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${loginCodeEmailSubject()}</title>
  </head>
  <body style="margin:0;background:#f8f7ff;padding:0;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#21219c;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Use este código para acessar sua área de influenciador na FindB Europa.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f7ff;background-image:radial-gradient(circle at 50% 0%,#ffffff 0,#ffffff 24%,#f8f7ff 62%,#fdf7fb 100%);">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
            <tr>
              <td align="center" style="padding:0 0 18px;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="width:124px;height:124px;border-radius:999px;background:#ffffff;border:1px solid #ece9ff;box-shadow:0 24px 60px rgba(33,33,156,.16),0 12px 28px rgba(221,53,103,.13);">
                      <img src="${logoUrl}" width="92" alt="FindB Europa" style="display:block;width:92px;max-width:92px;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="border-radius:24px;background:#ffffff;border:1px solid #ffffff;box-shadow:0 28px 70px rgba(33,33,156,.14);overflow:hidden;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:28px 26px 8px;text-align:center;">
                      <div style="font-size:10px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#dd3567;">
                        Acesso seguro
                      </div>
                      <h1 style="margin:10px 0 0;font-size:34px;line-height:1.05;font-weight:900;letter-spacing:0;color:#21219c;">
                        Código de acesso
                      </h1>
                      <p style="margin:12px auto 0;max-width:410px;font-size:15px;line-height:1.65;font-weight:700;color:#62627e;">
                        Use o código abaixo para entrar na sua área de influenciador e acompanhar links, campanhas, materiais e ganhos.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px 22px 6px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-radius:20px;background:#21219c;background-image:linear-gradient(135deg,#21219c 0%,#3434b4 52%,#dd3567 100%);box-shadow:0 20px 45px rgba(33,33,156,.22);">
                        <tr>
                          <td align="center" style="padding:22px 12px;">
                            <div style="font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#ffffff;opacity:.86;">
                              Seu código
                            </div>
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:14px auto 0;">
                              <tr>
                                ${codeDigits
                                  .map(
                                    (digit) => `<td align="center" style="padding:0 3px;">
                                      <div style="width:43px;height:50px;border-radius:13px;background:#ffffff;color:#21219c;font-size:25px;line-height:50px;font-weight:900;letter-spacing:0;box-shadow:inset 0 -1px 0 rgba(33,33,156,.08);">
                                        ${digit}
                                      </div>
                                    </td>`,
                                  )
                                  .join("")}
                              </tr>
                            </table>
                            <div style="margin-top:16px;font-size:13px;line-height:1.5;font-weight:800;color:#ffffff;">
                              Válido por ${minutes} minutos.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:18px 24px 24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="border-radius:16px;background:#f4f3fb;border:1px solid #ece9ff;padding:14px 16px;">
                            <div style="font-size:13px;line-height:1.6;font-weight:700;color:#62627e;">
                              Por segurança, não compartilhe este código. A equipe FindB Europa nunca vai pedir seu código fora desta tela de acesso.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:18px 18px 0;">
                <p style="margin:0;font-size:12px;line-height:1.65;font-weight:700;color:#7b7b98;">
                  Se você não solicitou este acesso, ignore este email.
                </p>
                <p style="margin:8px 0 0;font-size:11px;line-height:1.5;font-weight:800;letter-spacing:.3px;color:#21219c;">
                  FindB Europa
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

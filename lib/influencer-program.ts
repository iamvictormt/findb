import { prisma } from "@/lib/prisma"
import { getRequestOrigin } from "@/lib/request-url"

export type CountryLang = "ptBr" | "ptPt" | "en" | "es" | "fr"

export const influencerBenefits = [
  "Pagamentos em euros",
  "Materiais oficiais gratuitos",
  "Campanhas com objetivos claros",
  "Painel de desempenho",
  "Programa de embaixadores",
  "Suporte dedicado",
]

export const acceptedCountries = [
  "Alemanha",
  "Albânia",
  "Andorra",
  "Armênia",
  "Áustria",
  "Azerbaijão",
  "Belarus",
  "Bélgica",
  "Bósnia e Herzegovina",
  "Bulgária",
  "Chipre",
  "Croácia",
  "Dinamarca",
  "Espanha",
  "Eslováquia",
  "Eslovênia",
  "Estônia",
  "Finlândia",
  "França",
  "Geórgia",
  "Grécia",
  "Hungria",
  "Irlanda",
  "Islândia",
  "Itália",
  "Kosovo",
  "Letônia",
  "Liechtenstein",
  "Lituânia",
  "Luxemburgo",
  "Macedônia do Norte",
  "Malta",
  "Moldávia",
  "Mônaco",
  "Montenegro",
  "Noruega",
  "Países Baixos",
  "Polônia",
  "Portugal",
  "República Tcheca",
  "Reino Unido",
  "Romênia",
  "Rússia",
  "San Marino",
  "Sérvia",
  "Suécia",
  "Suíça",
  "Turquia",
  "Ucrânia",
  "Vaticano",
  "Outro país europeu",
]

const localeByCountryLang: Record<CountryLang, string> = {
  ptBr: "pt-BR",
  ptPt: "pt-PT",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
}

const countryCodeByName: Record<string, string> = {
  Alemanha: "DE",
  Albânia: "AL",
  Andorra: "AD",
  Armênia: "AM",
  Áustria: "AT",
  Azerbaijão: "AZ",
  Belarus: "BY",
  Bélgica: "BE",
  "Bósnia e Herzegovina": "BA",
  Bulgária: "BG",
  Chipre: "CY",
  Croácia: "HR",
  Dinamarca: "DK",
  Espanha: "ES",
  Eslováquia: "SK",
  Eslovênia: "SI",
  Estônia: "EE",
  Finlândia: "FI",
  França: "FR",
  Geórgia: "GE",
  Grécia: "GR",
  Hungria: "HU",
  Irlanda: "IE",
  Islândia: "IS",
  Itália: "IT",
  Kosovo: "XK",
  Letônia: "LV",
  Liechtenstein: "LI",
  Lituânia: "LT",
  Luxemburgo: "LU",
  "Macedônia do Norte": "MK",
  Malta: "MT",
  Moldávia: "MD",
  Mônaco: "MC",
  Montenegro: "ME",
  Noruega: "NO",
  "Países Baixos": "NL",
  Polônia: "PL",
  Portugal: "PT",
  "República Tcheca": "CZ",
  "Reino Unido": "GB",
  Romênia: "RO",
  Rússia: "RU",
  "San Marino": "SM",
  Sérvia: "RS",
  Suécia: "SE",
  Suíça: "CH",
  Turquia: "TR",
  Ucrânia: "UA",
  Vaticano: "VA",
}

export function getLocalizedAcceptedCountries(lang: CountryLang, otherEuropeanCountry?: string) {
  const locale = localeByCountryLang[lang]
  const displayNames = typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames([locale], { type: "region" })
    : null
  const collator = new Intl.Collator(locale)
  const countries = acceptedCountries
    .filter((country) => country !== "Outro país europeu")
    .map((country) => ({
      value: country,
      label: countryCodeByName[country] && displayNames
        ? displayNames.of(countryCodeByName[country]) ?? country
        : country,
    }))
    .sort((first, second) => collator.compare(first.label, second.label))

  return otherEuropeanCountry
    ? [
        ...countries,
        {
          value: "Outro país europeu",
          label: otherEuropeanCountry,
        },
      ]
    : countries
}

export const influencerMenu = [
  ["Dashboard", "Resultados, ganhos, campanhas e estatísticas."],
  ["Meu Perfil", "Dados, redes sociais, categorias, idiomas e documentação."],
  ["Meu Link", "Copiar link, gerar QR Code, compartilhar e personalizar URL."],
  ["Campanhas", "Valores, prazos, objetivos, materiais e status."],
  ["Central de Conteúdo", "Vídeos, fotos, logos, stories, reels, textos e hashtags."],
  ["Ganhos", "Saldo disponível, pendente, extrato e próximos pagamentos."],
  ["Ranking", "Ranking semanal, mensal, anual, conquistas e badges."],
  ["Desafios", "Missões especiais, bônus e campanhas sazonais."],
] as const

export function formatEuro(cents: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}

export function makeReferralUrl(slug: string, origin?: string) {
  const baseUrl = origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://findbeuropa.com"
  return `${baseUrl.replace(/\/$/, "")}/i/${slug}`
}

export function makeReferralUrlFromHeaders(slug: string, headers: Pick<Headers, "get">) {
  return makeReferralUrl(slug, getRequestOrigin(headers))
}

export async function getProgramOverview() {
  const [campaigns, assets] = await Promise.all([
    prisma.campaign.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.contentAsset.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ])

  return { campaigns, assets }
}

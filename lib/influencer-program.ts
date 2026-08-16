import { prisma } from "@/lib/prisma"
import { getRequestOrigin } from "@/lib/request-url"

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

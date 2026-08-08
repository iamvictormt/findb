import { siteUrl } from "@/lib/findb-data"
import { prisma } from "@/lib/prisma"

export const influencerBenefits = [
  "Pagamentos em euros",
  "Materiais oficiais gratuitos",
  "Campanhas com objetivos claros",
  "Painel de desempenho",
  "Programa de embaixadores",
  "Suporte dedicado",
]

export const acceptedCountries = [
  "Portugal",
  "Irlanda",
  "Espanha",
  "França",
  "Itália",
  "Alemanha",
  "Países Baixos",
  "Bélgica",
  "Luxemburgo",
  "Suíça",
  "Áustria",
  "Suécia",
  "Noruega",
  "Dinamarca",
  "Finlândia",
  "Polônia",
  "República Tcheca",
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

export function makeReferralUrl(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteUrl.href.replace(/\/$/, "")
  return `${baseUrl}/i/${slug}`
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
      take: 6,
    }),
  ])

  return { campaigns, assets }
}

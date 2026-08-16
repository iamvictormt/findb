import "server-only"

import { linkTags } from "@/lib/findb-data"
import { prisma } from "@/lib/prisma"

export type HomeLinkView = {
  id: string
  title: string
  subtitle: string
  titlePtPt?: string | null
  subtitlePtPt?: string | null
  titleEn?: string | null
  subtitleEn?: string | null
  titleEs?: string | null
  subtitleEs?: string | null
  titleFr?: string | null
  subtitleFr?: string | null
  href: string
  icon: string
  tone: "blue" | "pink" | "cyan" | "green" | "gold"
  sortOrder: number
  isActive: boolean
}

const defaultIconById: Record<string, string> = {
  influenciadores: "BadgeEuro",
  paises: "Globe2",
  grupos: "UsersRound",
  cartao: "CreditCard",
  parceiro: "Handshake",
  indicacoes: "BriefcaseBusiness",
  whatsapp: "MessageCircle",
  networking: "Network",
  eventos: "CalendarDays",
  viagens: "Plane",
}

const validTones = new Set<HomeLinkView["tone"]>(["blue", "pink", "cyan", "green", "gold"])

export const fallbackHomeLinks: HomeLinkView[] = linkTags.map((link, index) => ({
  id: link.id,
  title: link.title,
  subtitle: link.subtitle,
  ...getFallbackTranslation(link.id),
  href: link.href,
  icon: defaultIconById[link.id] ?? "ChevronRight",
  tone: link.tone,
  sortOrder: (index + 1) * 10,
  isActive: true,
}))

export async function getActiveHomeLinks() {
  try {
    const links = await prisma.homeLink.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })

    return links.length ? links.map(toHomeLinkView) : fallbackHomeLinks
  } catch {
    return fallbackHomeLinks
  }
}

export function toHomeLinkView(link: {
  id: string
  title: string
  subtitle: string
  titlePtPt?: string | null
  subtitlePtPt?: string | null
  titleEn?: string | null
  subtitleEn?: string | null
  titleEs?: string | null
  subtitleEs?: string | null
  titleFr?: string | null
  subtitleFr?: string | null
  href: string
  icon: string
  tone: string
  sortOrder: number
  isActive: boolean
}): HomeLinkView {
  return {
    id: link.id,
    title: link.title,
    subtitle: link.subtitle,
    titlePtPt: link.titlePtPt,
    subtitlePtPt: link.subtitlePtPt,
    titleEn: link.titleEn,
    subtitleEn: link.subtitleEn,
    titleEs: link.titleEs,
    subtitleEs: link.subtitleEs,
    titleFr: link.titleFr,
    subtitleFr: link.subtitleFr,
    href: link.href,
    icon: link.icon,
    tone: validTones.has(link.tone as HomeLinkView["tone"]) ? (link.tone as HomeLinkView["tone"]) : "blue",
    sortOrder: link.sortOrder,
    isActive: link.isActive,
  }
}

function getFallbackTranslation(id: string) {
  const translations: Record<string, Partial<HomeLinkView>> = {
    influenciadores: {
      titlePtPt: "Influenciadores Imigrantes",
      subtitlePtPt: "Divulgue a bio e ganhe em euros",
      titleEn: "Immigrant Influencers",
      subtitleEn: "Share the bio and earn in euros",
      titleEs: "Influencers Inmigrantes",
      subtitleEs: "Comparte la bio y gana en euros",
      titleFr: "Influenceurs immigrants",
      subtitleFr: "Partagez la bio et gagnez en euros",
    },
    paises: {
      titlePtPt: "Escolha o seu país europeu",
      subtitlePtPt: "Encontre comunidades no seu país",
      titleEn: "Choose your European country",
      subtitleEn: "Find communities in your country",
      titleEs: "Elige tu país europeo",
      subtitleEs: "Encuentra comunidades en tu país",
      titleFr: "Choisissez votre pays européen",
      subtitleFr: "Trouvez des communautés dans votre pays",
    },
    grupos: {
      titlePtPt: "Entrar nos grupos",
      subtitlePtPt: "Comunidades e fóruns",
      titleEn: "Join the groups",
      subtitleEn: "Communities and forums",
      titleEs: "Entrar en los grupos",
      subtitleEs: "Comunidades y foros",
      titleFr: "Rejoindre les groupes",
      subtitleFr: "Communautés et forums",
    },
    cartao: {
      titlePtPt: "Adquira o seu cartão de membro",
      subtitlePtPt: "Benefícios exclusivos",
      titleEn: "Get your member card",
      subtitleEn: "Exclusive benefits",
      titleEs: "Adquiere tu tarjeta de miembro",
      subtitleEs: "Beneficios exclusivos",
      titleFr: "Obtenez votre carte de membre",
      subtitleFr: "Avantages exclusifs",
    },
    parceiro: {
      titlePtPt: "Seja parceiro ou afiliado FindB",
      subtitlePtPt: "Parcerias que aproximam",
      titleEn: "Become a FindB partner or affiliate",
      subtitleEn: "Partnerships that connect",
      titleEs: "Sé socio o afiliado FindB",
      subtitleEs: "Alianzas que conectan",
      titleFr: "Devenez partenaire ou affilié FindB",
      subtitleFr: "Des partenariats qui connectent",
    },
    indicacoes: {
      titlePtPt: "Indicações",
      subtitlePtPt: "Emprego, habitação e muito mais.",
      titleEn: "Recommendations",
      subtitleEn: "Jobs, Housing and much more.",
      titleEs: "Indicaciones",
      subtitleEs: "Empleos, Viviendas y mucho más.",
      titleFr: "Indications",
      subtitleFr: "Emplois, logements et bien plus.",
    },
  }

  return translations[id] ?? {}
}

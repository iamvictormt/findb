import type { LucideIcon } from "lucide-react"
import {
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  Globe2,
  Handshake,
  Home,
  MessageCircle,
  Network,
  Plane,
  UsersRound,
} from "lucide-react"

/**
 * PAINEL DE LINKS DA FINDB EUROPA
 *
 * Edite apenas os campos "href" para conectar cada tag ao seu grupo
 * de WhatsApp, site, formulário, página de evento ou checkout.
 */

export type LinkTag = {
  id: string
  title: string
  subtitle: string
  href: string
  icon: LucideIcon
  tone: "blue" | "pink" | "cyan" | "green" | "gold"
}

export const linkTags: LinkTag[] = [
  {
    id: "paises",
    title: "Escolha seu país Europeu",
    subtitle: "Encontre comunidades no seu país",
    href: "#bandeiras",
    icon: Globe2,
    tone: "blue",
  },
  {
    id: "grupos",
    title: "Entrar nos grupos",
    subtitle: "Comunidades e fóruns",
    href: "https://wa.me/",
    icon: UsersRound,
    tone: "pink",
  },
  {
    id: "parceiro",
    title: "Seja um parceiro ou afiliado FindB",
    subtitle: "Parcerias que conectam",
    href: "#",
    icon: Handshake,
    tone: "cyan",
  },
  {
    id: "indicacoes",
    title: "Indicações",
    subtitle: "Empregos, Moradias e muito mais.",
    href: "#",
    icon: BriefcaseBusiness,
    tone: "gold",
  },
  {
    id: "whatsapp",
    title: "Traga seu grupo de WhatsApp",
    subtitle: "ou crie sua comunidade",
    href: "https://wa.me/",
    icon: MessageCircle,
    tone: "green",
  },
  {
    id: "networking",
    title: "Networking",
    subtitle: "Empresas e projetos",
    href: "#",
    icon: Network,
    tone: "blue",
  },
  {
    id: "eventos",
    title: "Participe de eventos presenciais",
    subtitle: "Encontros que transformam",
    href: "#",
    icon: CalendarDays,
    tone: "pink",
  },
  {
    id: "viagens",
    title: "Passagens aéreas, hospedagens,",
    subtitle: "viagens e turismo",
    href: "#",
    icon: Plane,
    tone: "blue",
  },
  {
    id: "cartao",
    title: "Adquirir seu cartão de membro",
    subtitle: "Benefícios exclusivos",
    href: "#cartoes",
    icon: CreditCard,
    tone: "gold",
  },
]

export type Stat = { id: string; icon: LucideIcon; value: string; label: string }

export const stats: Stat[] = [
  { id: "paises", icon: Globe2, value: "+30", label: "Países europeus" },
  { id: "membros", icon: UsersRound, value: "Milhares", label: "de membros" },
  { id: "empregos", icon: BriefcaseBusiness, value: "Empregos e", label: "oportunidades" },
  { id: "moradias", icon: Home, value: "Moradias", label: "e acessos" },
  { id: "networking", icon: Handshake, value: "Networking", label: "e parcerias" },
  { id: "eventos", icon: CalendarDays, value: "Eventos", label: "presenciais" },
]

export type MemberCard = {
  id: string
  tier: string
  tagline: string
  perks: string[]
  href: string
  variant: "connect" | "plus" | "founder"
}

export const memberCards: MemberCard[] = [
  {
    id: "connect",
    tier: "Connect",
    tagline: "Para entrar, participar e encontrar sua comunidade",
    perks: ["Grupos por país", "Mural de indicações", "Benefícios parceiros"],
    href: "#",
    variant: "connect",
  },
  {
    id: "plus",
    tier: "Plus",
    tagline: "Para crescer sua rede e acessar oportunidades",
    perks: ["Eventos presenciais", "Networking exclusivo", "Destaques da comunidade"],
    href: "#",
    variant: "plus",
  },
  {
    id: "founder",
    tier: "Founder",
    tagline: "Para líderes, parceiros e afiliados FindB",
    perks: ["Selo parceiro", "Prioridade em projetos", "Acesso premium"],
    href: "#",
    variant: "founder",
  },
]

export type Social = { id: string; label: string; href: string }

export const socials: Social[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/findbeuropaoficial?igsh=dW44bmN5NTVneTlz&utm_source=qr",
  },
  { id: "facebook", label: "Facebook", href: "https://facebook.com/" },
  { id: "youtube", label: "YouTube", href: "https://youtube.com/" },
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/" },
  { id: "telegram", label: "Telegram", href: "https://t.me/" },
]

export const siteUrl = {
  label: "comunidadesfindbeuropa.com",
  href: "https://www.comunidadesfindbeuropa.com",
}

export const supportEmail = {
  label: "suporte@comunidadesfindbeuropa.com",
  href: "mailto:suporte@comunidadesfindbeuropa.com",
}

export type Country = { code: string; name: string }

export const countries: Country[] = [
  { code: "al", name: "Albânia" },
  { code: "ad", name: "Andorra" },
  { code: "de", name: "Alemanha" },
  { code: "at", name: "Áustria" },
  { code: "be", name: "Bélgica" },
  { code: "ba", name: "Bósnia e Herzegovina" },
  { code: "bg", name: "Bulgária" },
  { code: "cz", name: "Tchéquia" },
  { code: "cy", name: "Chipre" },
  { code: "hr", name: "Croácia" },
  { code: "dk", name: "Dinamarca" },
  { code: "sk", name: "Eslováquia" },
  { code: "si", name: "Eslovênia" },
  { code: "es", name: "Espanha" },
  { code: "ee", name: "Estônia" },
  { code: "fi", name: "Finlândia" },
  { code: "fr", name: "França" },
  { code: "gr", name: "Grécia" },
  { code: "hu", name: "Hungria" },
  { code: "ie", name: "Irlanda" },
  { code: "is", name: "Islândia" },
  { code: "it", name: "Itália" },
  { code: "xk", name: "Kosovo" },
  { code: "lv", name: "Letônia" },
  { code: "li", name: "Liechtenstein" },
  { code: "lt", name: "Lituânia" },
  { code: "lu", name: "Luxemburgo" },
  { code: "mk", name: "Macedônia do Norte" },
  { code: "mt", name: "Malta" },
  { code: "md", name: "Moldávia" },
  { code: "mc", name: "Mônaco" },
  { code: "me", name: "Montenegro" },
  { code: "no", name: "Noruega" },
  { code: "nl", name: "Países Baixos" },
  { code: "pl", name: "Polônia" },
  { code: "pt", name: "Portugal" },
  { code: "gb", name: "Reino Unido" },
  { code: "ro", name: "Romênia" },
  { code: "sm", name: "San Marino" },
  { code: "rs", name: "Sérvia" },
  { code: "se", name: "Suécia" },
  { code: "ch", name: "Suíça" },
  { code: "ua", name: "Ucrânia" },
  { code: "va", name: "Vaticano" },
]

export const countryFlagPreview = [
  "pt",
  "es",
  "fr",
  "de",
  "it",
  "nl",
  "be",
  "ie",
  "at",
  "ch",
  "se",
  "no",
  "dk",
  "fi",
]

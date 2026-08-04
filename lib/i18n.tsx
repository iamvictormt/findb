"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Lang = "pt" | "en" | "es"

const STORAGE_KEY = "findb-europa-lang"
const COOKIE_KEY = "findb-lang"

export const languages: { code: Lang; label: string; name: string }[] = [
  { code: "pt", label: "PT", name: "Português" },
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
]

const translations = {
  pt: {
    header: {
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      language: "Selecionar idioma",
    },
    hero: {
      community: "Comunidades brasileiras na Europa.",
      join: "Junte-se a nós.",
      tagline: "Construindo relacionamentos saudáveis.",
    },
    links: {
      paises: ["Escolha seu país Europeu", "Encontre comunidades no seu país"],
      grupos: ["Entrar nos grupos", "Comunidades e fóruns"],
      parceiro: ["Seja um parceiro ou afiliado FindB", "Parcerias que conectam"],
      indicacoes: ["Indicações", "Empregos, Moradias e muito mais."],
      whatsapp: ["Traga seu grupo de WhatsApp", "ou crie sua comunidade"],
      networking: ["Networking", "Empresas e projetos"],
      eventos: ["Participe de eventos presenciais", "Encontros que transformam"],
      viagens: ["Passagens aéreas, hospedagens,", "viagens e turismo"],
      cartao: ["Adquirir seu cartão de membro", "Benefícios exclusivos"],
    },
    stats: {
      paises: ["+30", "Países europeus"],
      membros: ["Milhares", "de membros"],
      empregos: ["Empregos e", "oportunidades"],
      moradias: ["Moradias", "e acessos"],
      networking: ["Networking", "e parcerias"],
      eventos: ["Eventos", "presenciais"],
    },
    flags: {
      title: "Todos os países.",
      accent: "Uma só comunidade.",
    },
    footer: {
      follow: "Siga nossas redes",
      learnMore: "Saiba mais",
      site: "findbeuropa.com",
      connected: "Conectando brasileiros,",
      stories: "unindo histórias",
    },
  },
  en: {
    header: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      language: "Select language",
    },
    hero: {
      community: "Brazilian communities in Europe.",
      join: "Join us.",
      tagline: "Building healthy relationships.",
    },
    links: {
      paises: ["Choose your European country", "Find communities in your country"],
      grupos: ["Join the groups", "Communities and forums"],
      parceiro: ["Become a FindB partner or affiliate", "Partnerships that connect"],
      indicacoes: ["Recommendations", "Jobs, Housing and much more."],
      whatsapp: ["Bring your WhatsApp group", "or create your community"],
      networking: ["Networking", "Companies and projects"],
      eventos: ["Join in-person events", "Meetups that transform"],
      viagens: ["Flights, stays,", "travel and tourism"],
      cartao: ["Get your member card", "Exclusive benefits"],
    },
    stats: {
      paises: ["+30", "European countries"],
      membros: ["Thousands", "of members"],
      empregos: ["Jobs and", "opportunities"],
      moradias: ["Housing", "and access"],
      networking: ["Networking", "and partners"],
      eventos: ["In-person", "events"],
    },
    flags: {
      title: "All countries.",
      accent: "One community.",
    },
    footer: {
      follow: "Follow our socials",
      learnMore: "Learn more",
      site: "findbeuropa.com",
      connected: "Connecting Brazilians,",
      stories: "uniting stories",
    },
  },
  es: {
    header: {
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      language: "Seleccionar idioma",
    },
    hero: {
      community: "Comunidades brasileñas en Europa.",
      join: "Únete a nosotros.",
      tagline: "Construyendo relaciones saludables.",
    },
    links: {
      paises: ["Elige tu país Europeo", "Encuentra comunidades en tu país"],
      grupos: ["Entrar en los grupos", "Comunidades y foros"],
      parceiro: ["Sé socio o afiliado FindB", "Alianzas que conectan"],
      indicacoes: ["Indicaciones", "Empleos, Viviendas y mucho más."],
      whatsapp: ["Trae tu grupo de WhatsApp", "o crea tu comunidad"],
      networking: ["Networking", "Empresas y proyectos"],
      eventos: ["Participa en eventos presenciales", "Encuentros que transforman"],
      viagens: ["Vuelos, hospedajes,", "viajes y turismo"],
      cartao: ["Adquiere tu tarjeta de miembro", "Beneficios exclusivos"],
    },
    stats: {
      paises: ["+30", "Países europeos"],
      membros: ["Miles", "de miembros"],
      empregos: ["Empleos y", "oportunidades"],
      moradias: ["Viviendas", "y accesos"],
      networking: ["Networking", "y alianzas"],
      eventos: ["Eventos", "presenciales"],
    },
    flags: {
      title: "Todos los países.",
      accent: "Una sola comunidad.",
    },
    footer: {
      follow: "Sigue nuestras redes",
      learnMore: "Saber más",
      site: "findbeuropa.com",
      connected: "Conectando brasileños,",
      stories: "uniendo historias",
    },
  },
} as const

type Messages = (typeof translations)[Lang]

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readCookieLang(): Lang | null {
  if (typeof document === "undefined") {
    return null
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE_KEY}=`))
    ?.split("=")[1]

  return isLang(cookie) ? cookie : null
}

function isLang(value: unknown): value is Lang {
  return value === "pt" || value === "en" || value === "es"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt")

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const nextLang = isLang(saved) ? saved : readCookieLang()

    if (nextLang) {
      setLangState(nextLang)
    }
  }, [])

  function setLang(nextLang: Lang) {
    setLangState(nextLang)
    window.localStorage.setItem(STORAGE_KEY, nextLang)
    document.cookie = `${COOKIE_KEY}=${nextLang}; path=/; max-age=31536000; SameSite=Lax`
    document.documentElement.lang = nextLang === "pt" ? "pt-BR" : nextLang
  }

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang
  }, [lang])

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: translations[lang],
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider")
  }

  return context
}

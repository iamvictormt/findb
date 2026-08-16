"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { ArrowRight, BadgeEuro, CheckCircle2 } from "lucide-react"
import { registerInfluencer, type InfluencerSignupState } from "@/app/influenciadores/actions"
import { acceptedCountries } from "@/lib/influencer-program"
import { CheckboxCard, CheckboxGrid, Field, FormPanel, Input, NumericInput, Select, SocialHandleInput, Textarea } from "@/components/ui/form-controls"
import { type Lang, translateFeedback, useI18n } from "@/lib/i18n"

const initialState: InfluencerSignupState = {
  ok: false,
  message: "",
}

const otherProfessionCategory = "Outras profissões"
const categories = [
  { value: "Criador de conteúdo", labelKey: "contentCreator" },
  { value: "Administrador de grupo", labelKey: "groupAdmin" },
  { value: "Eventos", labelKey: "events" },
  { value: "Moradia", labelKey: "housing" },
  { value: "Empregos", labelKey: "jobs" },
  { value: "Networking", labelKey: "networking" },
  { value: "Advogados", labelKey: "lawyers" },
  { value: otherProfessionCategory, labelKey: "otherProfessions" },
]
const languages = [
  { value: "Português", labelKey: "portuguese" },
  { value: "Inglês", labelKey: "english" },
  { value: "Espanhol", labelKey: "spanish" },
  { value: "Francês", labelKey: "french" },
  { value: "Italiano", labelKey: "italian" },
  { value: "Alemão", labelKey: "german" },
]

const localeByLang: Record<Lang, string> = {
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

const signupCopy: Record<
  Lang,
  {
    title: string
    description: string
    name: string
    email: string
    country: string
    select: string
    otherCountry: string
    otherEuropeanCountry: string
    otherCountryPlaceholder: string
    whatsapp: string
    whatsappHelper: string
    whatsappPlaceholder: string
    city: string
    network: string
    networkPlaceholder: string
    handle: string
    followers: string
    followersPlaceholder: string
    categories: string
    categoryLabels: Record<string, string>
    otherProfession: string
    otherProfessionPlaceholder: string
    languages: string
    languageLabels: Record<string, string>
    motivation: string
    motivationPlaceholder: string
    openDashboard: string
    sending: string
    submit: string
  }
> = {
  ptBr: {
    title: "Quero ganhar em euros",
    description: "Cadastre-se para receber link exclusivo, materiais e campanhas.",
    name: "Nome completo",
    email: "Email",
    country: "País onde reside",
    select: "Selecione",
    otherCountry: "Informe o país europeu",
    otherEuropeanCountry: "Outro país europeu",
    otherCountryPlaceholder: "Ex: Malta",
    whatsapp: "WhatsApp",
    whatsappHelper: "Informe apenas números, incluindo o código do país.",
    whatsappPlaceholder: "Ex: 351912345678",
    city: "Cidade",
    network: "Rede principal",
    networkPlaceholder: "Instagram, TikTok, YouTube...",
    handle: "@ do perfil",
    followers: "Seguidores aproximados",
    followersPlaceholder: "Ex: 2500",
    categories: "Categorias",
    categoryLabels: {
      contentCreator: "Criador de conteúdo",
      groupAdmin: "Administrador de grupo",
      events: "Eventos",
      housing: "Moradia",
      jobs: "Empregos",
      networking: "Networking",
      lawyers: "Advogados",
      otherProfessions: "Outras profissões",
    },
    otherProfession: "Informe a profissão",
    otherProfessionPlaceholder: "Ex: Contador, arquiteto, corretor...",
    languages: "Idiomas",
    languageLabels: {
      portuguese: "Português",
      english: "Inglês",
      spanish: "Espanhol",
      french: "Francês",
      italian: "Italiano",
      german: "Alemão",
    },
    motivation: "Como você quer ajudar a comunidade?",
    motivationPlaceholder: "Conte sobre seu público, grupos, cidade ou ideias de divulgação.",
    openDashboard: "Abrir meu painel",
    sending: "Enviando cadastro...",
    submit: "Quero participar",
  },
  ptPt: {
    title: "Quero ganhar em euros",
    description: "Registe-se para receber link exclusivo, materiais e campanhas.",
    name: "Nome completo",
    email: "Email",
    country: "País onde reside",
    select: "Selecione",
    otherCountry: "Informe o país europeu",
    otherEuropeanCountry: "Outro país europeu",
    otherCountryPlaceholder: "Ex: Malta",
    whatsapp: "WhatsApp",
    whatsappHelper: "Informe apenas números, incluindo o indicativo do país.",
    whatsappPlaceholder: "Ex: 351912345678",
    city: "Cidade",
    network: "Rede principal",
    networkPlaceholder: "Instagram, TikTok, YouTube...",
    handle: "@ do perfil",
    followers: "Seguidores aproximados",
    followersPlaceholder: "Ex: 2500",
    categories: "Categorias",
    categoryLabels: {
      contentCreator: "Criador de conteúdo",
      groupAdmin: "Administrador de grupo",
      events: "Eventos",
      housing: "Habitação",
      jobs: "Emprego",
      networking: "Networking",
      lawyers: "Advogados",
      otherProfessions: "Outras profissões",
    },
    otherProfession: "Informe a profissão",
    otherProfessionPlaceholder: "Ex: Contabilista, arquiteto, mediador...",
    languages: "Idiomas",
    languageLabels: {
      portuguese: "Português",
      english: "Inglês",
      spanish: "Espanhol",
      french: "Francês",
      italian: "Italiano",
      german: "Alemão",
    },
    motivation: "Como quer ajudar a comunidade?",
    motivationPlaceholder: "Conte sobre o seu público, grupos, cidade ou ideias de divulgação.",
    openDashboard: "Abrir o meu painel",
    sending: "A enviar registo...",
    submit: "Quero participar",
  },
  en: {
    title: "I want to earn in euros",
    description: "Sign up to receive an exclusive link, materials, and campaigns.",
    name: "Full name",
    email: "Email",
    country: "Country of residence",
    select: "Select",
    otherCountry: "Enter the European country",
    otherEuropeanCountry: "Other European country",
    otherCountryPlaceholder: "Ex: Malta",
    whatsapp: "WhatsApp",
    whatsappHelper: "Use numbers only, including the country code.",
    whatsappPlaceholder: "Ex: 351912345678",
    city: "City",
    network: "Main network",
    networkPlaceholder: "Instagram, TikTok, YouTube...",
    handle: "Profile @",
    followers: "Approximate followers",
    followersPlaceholder: "Ex: 2500",
    categories: "Categories",
    categoryLabels: {
      contentCreator: "Content creator",
      groupAdmin: "Group admin",
      events: "Events",
      housing: "Housing",
      jobs: "Jobs",
      networking: "Networking",
      lawyers: "Lawyers",
      otherProfessions: "Other professions",
    },
    otherProfession: "Enter the profession",
    otherProfessionPlaceholder: "Ex: Accountant, architect, broker...",
    languages: "Languages",
    languageLabels: {
      portuguese: "Portuguese",
      english: "English",
      spanish: "Spanish",
      french: "French",
      italian: "Italian",
      german: "German",
    },
    motivation: "How do you want to help the community?",
    motivationPlaceholder: "Tell us about your audience, groups, city, or promotion ideas.",
    openDashboard: "Open my dashboard",
    sending: "Sending signup...",
    submit: "I want to join",
  },
  es: {
    title: "Quiero ganar en euros",
    description: "Regístrate para recibir link exclusivo, materiales y campañas.",
    name: "Nombre completo",
    email: "Email",
    country: "País donde resides",
    select: "Selecciona",
    otherCountry: "Informa el país europeo",
    otherEuropeanCountry: "Otro país europeo",
    otherCountryPlaceholder: "Ej: Malta",
    whatsapp: "WhatsApp",
    whatsappHelper: "Informa solo números, incluyendo el código del país.",
    whatsappPlaceholder: "Ej: 351912345678",
    city: "Ciudad",
    network: "Red principal",
    networkPlaceholder: "Instagram, TikTok, YouTube...",
    handle: "@ del perfil",
    followers: "Seguidores aproximados",
    followersPlaceholder: "Ej: 2500",
    categories: "Categorías",
    categoryLabels: {
      contentCreator: "Creador de contenido",
      groupAdmin: "Administrador de grupo",
      events: "Eventos",
      housing: "Vivienda",
      jobs: "Empleos",
      networking: "Networking",
      lawyers: "Abogados",
      otherProfessions: "Otras profesiones",
    },
    otherProfession: "Informa la profesión",
    otherProfessionPlaceholder: "Ej: Contador, arquitecto, corredor...",
    languages: "Idiomas",
    languageLabels: {
      portuguese: "Portugués",
      english: "Inglés",
      spanish: "Español",
      french: "Francés",
      italian: "Italiano",
      german: "Alemán",
    },
    motivation: "¿Cómo quieres ayudar a la comunidad?",
    motivationPlaceholder: "Cuéntanos sobre tu público, grupos, ciudad o ideas de divulgación.",
    openDashboard: "Abrir mi panel",
    sending: "Enviando registro...",
    submit: "Quiero participar",
  },
  fr: {
    title: "Je veux gagner en euros",
    description: "Inscrivez-vous pour recevoir un lien exclusif, des supports et des campagnes.",
    name: "Nom complet",
    email: "Email",
    country: "Pays de résidence",
    select: "Sélectionner",
    otherCountry: "Indiquez le pays européen",
    otherEuropeanCountry: "Autre pays européen",
    otherCountryPlaceholder: "Ex : Malte",
    whatsapp: "WhatsApp",
    whatsappHelper: "Indiquez uniquement des chiffres, avec l'indicatif du pays.",
    whatsappPlaceholder: "Ex : 351912345678",
    city: "Ville",
    network: "Réseau principal",
    networkPlaceholder: "Instagram, TikTok, YouTube...",
    handle: "@ du profil",
    followers: "Abonnés approximatifs",
    followersPlaceholder: "Ex : 2500",
    categories: "Catégories",
    categoryLabels: {
      contentCreator: "Créateur de contenu",
      groupAdmin: "Administrateur de groupe",
      events: "Événements",
      housing: "Logement",
      jobs: "Emplois",
      networking: "Networking",
      lawyers: "Avocats",
      otherProfessions: "Autres professions",
    },
    otherProfession: "Indiquez la profession",
    otherProfessionPlaceholder: "Ex : Comptable, architecte, courtier...",
    languages: "Langues",
    languageLabels: {
      portuguese: "Portugais",
      english: "Anglais",
      spanish: "Espagnol",
      french: "Français",
      italian: "Italien",
      german: "Allemand",
    },
    motivation: "Comment voulez-vous aider la communauté ?",
    motivationPlaceholder: "Parlez de votre audience, vos groupes, votre ville ou vos idées de promotion.",
    openDashboard: "Ouvrir mon tableau",
    sending: "Envoi de l'inscription...",
    submit: "Je veux participer",
  },
}

export function InfluencerSignupForm() {
  const [state, formAction, pending] = useActionState(registerInfluencer, initialState)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [showOtherProfession, setShowOtherProfession] = useState(false)
  const { lang, t } = useI18n()
  const copy = signupCopy[lang]
  const countryOptions = getCountryOptions(lang, copy.otherEuropeanCountry)

  return (
    <form action={formAction}>
      <FormPanel className="grid gap-3">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-gradient-brand text-white">
          <BadgeEuro className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-extrabold text-primary">{copy.title}</h2>
          <p className="text-xs font-semibold leading-relaxed text-muted-foreground">
            {copy.description}
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Field label={copy.name}>
          <Input name="name" required />
        </Field>
        <Field label={copy.email}>
          <Input name="email" type="email" required />
        </Field>
        <Field label={copy.country}>
          <Select
            name="country"
            required
            placeholder={copy.select}
            onValueChange={setSelectedCountry}
            options={countryOptions}
          />
        </Field>
        {selectedCountry === "Outro país europeu" && (
          <Field label={copy.otherCountry} className="sm:col-span-2">
            <Input name="otherCountry" placeholder={copy.otherCountryPlaceholder} required />
          </Field>
        )}
        <Field label={copy.whatsapp} helper={copy.whatsappHelper}>
          <NumericInput name="whatsapp" maxLength={15} placeholder={copy.whatsappPlaceholder} required />
        </Field>
        <Field label={copy.city}>
          <Input name="city" />
        </Field>
        <Field label={copy.network}>
          <Input name="primaryNetwork" placeholder={copy.networkPlaceholder} required />
        </Field>
        <Field label={copy.handle}>
          <SocialHandleInput name="socialHandle" required />
        </Field>
        <Field label={copy.followers}>
          <NumericInput name="audienceSize" maxLength={9} placeholder={copy.followersPlaceholder} />
        </Field>
      </div>

      <CheckboxGroup
        title={copy.categories}
        name="categories"
        options={categories.map((category) => ({
          value: category.value,
          label: copy.categoryLabels[category.labelKey],
        }))}
        onOptionChange={(option, checked) => {
          if (option === otherProfessionCategory) {
            setShowOtherProfession(checked)
          }
        }}
      />
      {showOtherProfession && (
        <Field label={copy.otherProfession}>
          <Input name="otherProfession" placeholder={copy.otherProfessionPlaceholder} required />
        </Field>
      )}
      <CheckboxGroup
        title={copy.languages}
        name="languages"
        options={languages.map((language) => ({
          value: language.value,
          label: copy.languageLabels[language.labelKey],
        }))}
      />

      <Field label={copy.motivation}>
        <Textarea
          name="motivation"
          rows={4}
          placeholder={copy.motivationPlaceholder}
        />
      </Field>

      {state.message && (
        <div className={`rounded-lg px-3 py-2 text-xs font-bold leading-relaxed ${state.ok ? "bg-emerald-500/10 text-emerald-700" : "bg-accent/10 text-accent"}`} aria-live="polite">
          {translateFeedback(t, state.message)}
          {state.profileUrl && (
            <Link href={state.profileUrl} className="mt-2 inline-flex items-center gap-1 text-primary underline underline-offset-4">
              {copy.openDashboard} <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
      >
        <CheckCircle2 className="size-4" aria-hidden="true" />
        {pending ? copy.sending : copy.submit}
      </button>
      </FormPanel>
    </form>
  )
}

function getCountryOptions(lang: Lang, otherEuropeanCountry: string) {
  const locale = localeByLang[lang]
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

  return [
    ...countries,
    {
      value: "Outro país europeu",
      label: otherEuropeanCountry,
    },
  ]
}

function CheckboxGroup({
  title,
  name,
  options,
  onOptionChange,
}: {
  title: string
  name: string
  options: Array<{ value: string; label: string }>
  onOptionChange?: (option: string, checked: boolean) => void
}) {
  return (
    <CheckboxGrid legend={title}>
      {options.map((option) => (
        <CheckboxCard
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          onChange={(event) => onOptionChange?.(option.value, event.currentTarget.checked)}
        />
      ))}
    </CheckboxGrid>
  )
}

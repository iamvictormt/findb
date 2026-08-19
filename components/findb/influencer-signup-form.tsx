"use client"

import Link from "next/link"
import { useActionState, useEffect, useMemo, useState } from "react"
import { ArrowRight, BadgeEuro, CalendarCheck2, CheckCircle2, Clock3 } from "lucide-react"
import { registerInfluencer, type InfluencerSignupState } from "@/app/influenciadores/actions"
import { getLocalizedAcceptedCountries } from "@/lib/influencer-program"
import { CheckboxCard, CheckboxGrid, Field, FormPanel, Input, NumericInput, Select, SocialHandleInput, Textarea } from "@/components/ui/form-controls"
import { type Lang, translateFeedback, useI18n } from "@/lib/i18n"
import { formatDateLong, formatTime } from "@/lib/scheduling"
import { cn } from "@/lib/utils"

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
    scheduleTitle: string
    scheduleDescription: string
    noSchedule: string
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
    scheduleTitle: "Agende sua conversa",
    scheduleDescription: "Depois das informações e categorias, escolha um horário liberado pela equipe.",
    noSchedule: "Nenhum horário disponível agora. Volte em breve para concluir o cadastro com agendamento.",
    openDashboard: "Abrir meu painel",
    sending: "Enviando cadastro...",
    submit: "Quero participar e agendar",
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
    scheduleTitle: "Agende a sua conversa",
    scheduleDescription: "Depois das informações e categorias, escolha um horário liberado pela equipa.",
    noSchedule: "Nenhum horário disponível agora. Volte em breve para concluir o registo com agendamento.",
    openDashboard: "Abrir o meu painel",
    sending: "A enviar registo...",
    submit: "Quero participar e agendar",
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
    scheduleTitle: "Schedule your conversation",
    scheduleDescription: "After your details and categories, choose a time released by the team.",
    noSchedule: "No times are available right now. Come back soon to finish signup with a meeting.",
    openDashboard: "Open my dashboard",
    sending: "Sending signup...",
    submit: "Join and schedule",
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
    scheduleTitle: "Agenda tu conversación",
    scheduleDescription: "Después de tus datos y categorías, elige un horario liberado por el equipo.",
    noSchedule: "No hay horarios disponibles ahora. Vuelve pronto para terminar el registro con agendamiento.",
    openDashboard: "Abrir mi panel",
    sending: "Enviando registro...",
    submit: "Quiero participar y agendar",
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
    scheduleTitle: "Planifiez votre conversation",
    scheduleDescription: "Après vos informations et catégories, choisissez un horaire publié par l'équipe.",
    noSchedule: "Aucun horaire disponible pour le moment. Revenez bientôt pour terminer l'inscription avec rendez-vous.",
    openDashboard: "Ouvrir mon tableau",
    sending: "Envoi de l'inscription...",
    submit: "Participer et planifier",
  },
}

type MeetingSlot = {
  id: string
  startsAt: string
  endsAt: string
}

export function InfluencerSignupForm({ meetingSlots }: { meetingSlots: MeetingSlot[] }) {
  const [state, formAction, pending] = useActionState(registerInfluencer, initialState)
  const values = state.values
  const [selectedCountry, setSelectedCountry] = useState(values?.country ?? "")
  const [showOtherProfession, setShowOtherProfession] = useState(values?.categories.includes(otherProfessionCategory) ?? false)
  const [selectedSlotId, setSelectedSlotId] = useState(values?.slotId || meetingSlots[0]?.id || "")
  const { lang, t } = useI18n()
  const copy = signupCopy[lang]
  const countryOptions = getCountryOptions(lang, copy.otherEuropeanCountry)
  const formResetKey = state.submittedAt ?? "initial"

  useEffect(() => {
    if (!values) {
      return
    }

    setSelectedCountry(values.country)
    setShowOtherProfession(values.categories.includes(otherProfessionCategory))
    setSelectedSlotId(values.slotId || meetingSlots[0]?.id || "")
  }, [meetingSlots, values])

  return (
    <form action={formAction}>
      <FormPanel key={formResetKey} className="grid gap-3">
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
          <Input name="name" defaultValue={values?.name} required />
        </Field>
        <Field label={copy.email}>
          <Input name="email" type="email" defaultValue={values?.email} required />
        </Field>
        <Field label={copy.country}>
          <Select
            name="country"
            required
            defaultValue={values?.country ?? ""}
            placeholder={copy.select}
            onValueChange={setSelectedCountry}
            options={countryOptions}
          />
        </Field>
        {selectedCountry === "Outro país europeu" && (
          <Field label={copy.otherCountry} className="sm:col-span-2">
            <Input name="otherCountry" defaultValue={values?.otherCountry} placeholder={copy.otherCountryPlaceholder} required />
          </Field>
        )}
        <Field label={copy.whatsapp} helper={copy.whatsappHelper}>
          <NumericInput name="whatsapp" maxLength={15} defaultValue={values?.whatsapp} placeholder={copy.whatsappPlaceholder} required />
        </Field>
        <Field label={copy.city}>
          <Input name="city" defaultValue={values?.city} />
        </Field>
        <Field label={copy.network}>
          <Input name="primaryNetwork" defaultValue={values?.primaryNetwork} placeholder={copy.networkPlaceholder} required />
        </Field>
        <Field label={copy.handle}>
          <SocialHandleInput name="socialHandle" defaultValue={values?.socialHandle} required />
        </Field>
        <Field label={copy.followers}>
          <NumericInput name="audienceSize" maxLength={9} defaultValue={values?.audienceSize} placeholder={copy.followersPlaceholder} />
        </Field>
      </div>

      <CheckboxGroup
        title={copy.categories}
        name="categories"
        options={categories.map((category) => ({
          value: category.value,
          label: copy.categoryLabels[category.labelKey],
        }))}
        selectedValues={values?.categories}
        onOptionChange={(option, checked) => {
          if (option === otherProfessionCategory) {
            setShowOtherProfession(checked)
          }
        }}
      />
      {showOtherProfession && (
        <Field label={copy.otherProfession}>
          <Input name="otherProfession" defaultValue={values?.otherProfession} placeholder={copy.otherProfessionPlaceholder} required />
        </Field>
      )}

      <MeetingSlotPicker
        title={copy.scheduleTitle}
        description={copy.scheduleDescription}
        emptyMessage={copy.noSchedule}
        slots={meetingSlots}
        selectedSlotId={selectedSlotId}
        onSelect={setSelectedSlotId}
      />

      <CheckboxGroup
        title={copy.languages}
        name="languages"
        options={languages.map((language) => ({
          value: language.value,
          label: copy.languageLabels[language.labelKey],
        }))}
        selectedValues={values?.languages}
      />

      <Field label={copy.motivation}>
        <Textarea
          name="motivation"
          rows={4}
          defaultValue={values?.motivation}
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
        disabled={pending || !selectedSlotId}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
      >
        <CheckCircle2 className="size-4" aria-hidden="true" />
        {pending ? copy.sending : copy.submit}
      </button>
      </FormPanel>
    </form>
  )
}

function MeetingSlotPicker({
  title,
  description,
  emptyMessage,
  slots,
  selectedSlotId,
  onSelect,
}: {
  title: string
  description: string
  emptyMessage: string
  slots: MeetingSlot[]
  selectedSlotId: string
  onSelect: (slotId: string) => void
}) {
  const groups = useMemo(() => groupSlotsByDay(slots), [slots])
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId)
  const [selectedDay, setSelectedDay] = useState(() => groups[0]?.key ?? "")
  const selectedGroup = groups.find((group) => group.key === selectedDay) ?? groups[0]

  function chooseDay(dayKey: string) {
    const day = groups.find((group) => group.key === dayKey)
    setSelectedDay(dayKey)
    onSelect(day?.slots[0]?.id ?? "")
  }

  return (
    <fieldset className="grid gap-3 rounded-[1rem] bg-primary/5 p-3 ring-1 ring-primary/6">
      <input type="hidden" name="slotId" value={selectedSlotId} readOnly />
      <legend className="sr-only">{title}</legend>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-accent shadow-[0_8px_18px_-16px_rgba(33,33,156,0.6)]">
          <CalendarCheck2 className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-extrabold text-primary">{title}</h3>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {groups.length ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {groups.map((group) => {
              const date = new Date(group.date)
              const active = group.key === selectedGroup?.key

              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => chooseDay(group.key)}
                  className={cn(
                    "grid min-h-[68px] content-center gap-1 rounded-lg bg-white px-3 py-2 text-left ring-1 ring-primary/8 transition hover:text-accent hover:ring-accent/20",
                    active && "bg-primary text-white ring-primary hover:text-white",
                  )}
                >
                  <span className={cn("text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground", active && "text-white/75")}>
                    {new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date)}
                  </span>
                  <span className="font-display text-base font-extrabold leading-none">
                    {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date)}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {selectedGroup?.slots.map((slot) => {
              const active = slot.id === selectedSlotId

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelect(slot.id)}
                  className={cn(
                    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-3 text-xs font-extrabold text-primary ring-1 ring-primary/8 transition hover:text-accent hover:ring-accent/20",
                    active && "bg-accent text-white ring-accent hover:text-white",
                  )}
                >
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  {formatTime(new Date(slot.startsAt))}
                </button>
              )
            })}
          </div>

          {selectedSlot && (
            <p className="rounded-lg bg-white px-3 py-2 text-[11px] font-bold leading-relaxed text-primary ring-1 ring-primary/8">
              Selecionado: <span className="capitalize">{formatDateLong(new Date(selectedSlot.startsAt))}</span>, {formatTime(new Date(selectedSlot.startsAt))}.
            </p>
          )}
        </>
      ) : (
        <p className="rounded-lg bg-white px-3 py-3 text-xs font-bold leading-relaxed text-muted-foreground ring-1 ring-primary/8">
          {emptyMessage}
        </p>
      )}
    </fieldset>
  )
}

function groupSlotsByDay(slots: MeetingSlot[]) {
  const groups = new Map<string, { key: string; date: string; slots: MeetingSlot[] }>()

  for (const slot of slots) {
    const date = new Date(slot.startsAt)
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-")

    if (!groups.has(key)) {
      groups.set(key, { key, date: date.toISOString(), slots: [] })
    }

    groups.get(key)?.slots.push(slot)
  }

  return Array.from(groups.values())
}

function getCountryOptions(lang: Lang, otherEuropeanCountry: string) {
  return getLocalizedAcceptedCountries(lang, otherEuropeanCountry)
}

function CheckboxGroup({
  title,
  name,
  options,
  selectedValues,
  onOptionChange,
}: {
  title: string
  name: string
  options: Array<{ value: string; label: string }>
  selectedValues?: string[]
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
          defaultChecked={selectedValues?.includes(option.value)}
          onChange={(event) => onOptionChange?.(option.value, event.currentTarget.checked)}
        />
      ))}
    </CheckboxGrid>
  )
}

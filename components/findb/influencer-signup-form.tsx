"use client"

import Link from "next/link"
import { useActionState } from "react"
import { ArrowRight, BadgeEuro, CheckCircle2 } from "lucide-react"
import { registerInfluencer, type InfluencerSignupState } from "@/app/influenciadores/actions"
import { acceptedCountries } from "@/lib/influencer-program"
import { CheckboxCard, CheckboxGrid, Field, FormPanel, Input, NumericInput, Select, Textarea } from "@/components/ui/form-controls"

const initialState: InfluencerSignupState = {
  ok: false,
  message: "",
}

const categories = ["Criador de conteúdo", "Administrador de grupo", "Eventos", "Moradia", "Empregos", "Networking"]
const languages = ["Português", "Inglês", "Espanhol", "Francês", "Italiano", "Alemão"]

export function InfluencerSignupForm() {
  const [state, formAction, pending] = useActionState(registerInfluencer, initialState)

  return (
    <form action={formAction}>
      <FormPanel className="grid gap-3">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-gradient-brand text-white">
          <BadgeEuro className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-extrabold text-primary">Quero ganhar em euros</h2>
          <p className="text-xs font-semibold leading-relaxed text-muted-foreground">
            Cadastre-se para receber link exclusivo, materiais e campanhas.
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Nome completo">
          <Input name="name" required />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" required />
        </Field>
        <Field label="WhatsApp">
          <Input name="whatsapp" required />
        </Field>
        <Field label="País onde reside">
          <Select
            name="country"
            required
            placeholder="Selecione"
            options={acceptedCountries.map((country) => ({
              value: country,
              label: country,
            }))}
          />
        </Field>
        <Field label="Cidade">
          <Input name="city" />
        </Field>
        <Field label="Rede principal">
          <Input name="primaryNetwork" placeholder="Instagram, TikTok, YouTube..." required />
        </Field>
        <Field label="@ do perfil">
          <Input name="socialHandle" placeholder="@seuperfil" required />
        </Field>
        <Field label="Seguidores aproximados">
          <NumericInput name="audienceSize" maxLength={9} placeholder="Ex: 2500" />
        </Field>
      </div>

      <CheckboxGroup title="Categorias" name="categories" options={categories} />
      <CheckboxGroup title="Idiomas" name="languages" options={languages} />

      <Field label="Como você quer ajudar a comunidade?">
        <Textarea
          name="motivation"
          rows={4}
          placeholder="Conte sobre seu público, grupos, cidade ou ideias de divulgação."
        />
      </Field>

      {state.message && (
        <div className={`rounded-lg px-3 py-2 text-xs font-bold leading-relaxed ${state.ok ? "bg-emerald-500/10 text-emerald-700" : "bg-accent/10 text-accent"}`} aria-live="polite">
          {state.message}
          {state.profileUrl && (
            <Link href={state.profileUrl} className="mt-2 inline-flex items-center gap-1 text-primary underline underline-offset-4">
              Abrir meu painel <ArrowRight className="size-3.5" aria-hidden="true" />
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
        {pending ? "Enviando cadastro..." : "Quero participar"}
      </button>
      </FormPanel>
    </form>
  )
}

function CheckboxGroup({ title, name, options }: { title: string; name: string; options: string[] }) {
  return (
    <CheckboxGrid legend={title}>
      {options.map((option) => (
        <CheckboxCard key={option} name={name} value={option} label={option} />
      ))}
    </CheckboxGrid>
  )
}

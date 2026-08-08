import Link from "next/link"
import { ArrowLeft, BadgeEuro, Mail, UserRound } from "lucide-react"
import { BrandLogo } from "@/components/findb/brand-logo"
import { CheckboxCard, CheckboxGrid, Field, FormPanel, Input, Select, Textarea } from "@/components/ui/form-controls"

export default function DesignSystemPage() {
  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para bio
        </Link>

        <section className="relative flex flex-col items-center text-center">
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />
          <p className="relative z-10 mt-4 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            FindB Europa
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">Design</span>{" "}
            <span className="text-accent">System</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            Componentes de formulário para manter inputs, selects, caixas de seleção e textos no mesmo padrão visual da bio.
          </p>
        </section>

        <FormPanel className="grid gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-gradient-brand text-white">
              <BadgeEuro className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold text-primary">Formulário base</h2>
              <p className="text-xs font-semibold leading-relaxed text-muted-foreground">
                Estados padrão, foco, texto de apoio e seleção.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Nome completo" helper="Use em cadastros e perfil">
              <Input placeholder="Maria Silva" />
            </Field>
            <Field label="Email" helper="Validação nativa do navegador">
              <Input type="email" placeholder="maria@email.com" />
            </Field>
            <Field label="Telefone" error="Mensagem de erro no padrão FindB">
              <Input placeholder="+351 000 000 000" aria-invalid="true" />
            </Field>
            <Field label="Tipo de perfil">
              <Select
                name="profileType"
                placeholder="Selecione"
                options={[
                  { value: "creator", label: "Criador de conteúdo" },
                  { value: "community", label: "Administrador de comunidade" },
                  { value: "partner", label: "Parceiro FindB" },
                ]}
              />
            </Field>
          </div>

          <Field label="Mensagem">
            <Textarea placeholder="Escreva uma descrição curta..." />
          </Field>

          <CheckboxGrid legend="Opções de interesse">
            <CheckboxCard name="demo" value="perfil" label="Meu Perfil" description="Foto, redes e idiomas" defaultChecked />
            <CheckboxCard name="demo" value="link" label="Meu Link" description="URL exclusiva e QR Code" />
            <CheckboxCard name="demo" value="campanhas" label="Campanhas" description="Prazos, valores e status" />
            <CheckboxCard name="demo" value="ganhos" label="Ganhos" description="Saldo e extrato em euros" />
            <CheckboxCard name="demo" value="ranking" label="Ranking" description="Conquistas e badges" />
            <CheckboxCard name="demo" value="conteudo" label="Conteúdo" description="Stories, reels e hashtags" />
          </CheckboxGrid>

          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(33,33,156,0.85)] transition hover:bg-accent">
              <UserRound className="size-4" aria-hidden="true" />
              Ação principal
            </button>
            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent/10 px-4 text-sm font-extrabold text-accent ring-1 ring-accent/10 transition hover:bg-accent hover:text-white">
              <Mail className="size-4" aria-hidden="true" />
              Ação secundária
            </button>
          </div>
        </FormPanel>

        <section className="rounded-[1.2rem] bg-white/88 p-4 text-xs font-semibold leading-relaxed text-muted-foreground ring-1 ring-white/90 sm:p-5">
          Use `Field` para label/helper/error, `Input`, `Select`, `Textarea`, `CheckboxCard`, `CheckboxGrid` e `FormPanel` para manter o mesmo acabamento em novos fluxos.
        </section>
      </div>
    </main>
  )
}

import Link from "next/link"
import { ArrowLeft, CalendarCheck2, Clock3, Mail, MessageCircle, Power, Trash2, UserRound, XCircle } from "lucide-react"
import { cancelPartnershipMeeting, createMeetingSlot, deleteMeetingSlot, toggleMeetingSlot } from "@/app/admin/agendamentos/actions"
import { BrandLogo } from "@/components/findb/brand-logo"
import { ConfirmActionDialog } from "@/components/findb/confirm-action-dialog"
import { HeroWorldMap } from "@/components/findb/hero-world-map"
import { MeetingSlotForm } from "@/components/findb/meeting-slot-form"
import { ToastMessage } from "@/components/findb/toast-message"
import { requireAdminSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDateLong, formatMeetingRange, formatTime } from "@/lib/scheduling"
import { adminSchedulingCopy, getServerCopy, getServerLang, type ServerLang } from "@/lib/server-copy"
import { getToastFromSearchParams } from "@/lib/toast"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminSchedulingPage({ searchParams }: PageProps) {
  await requireAdminSession()
  const [toast, c, lang] = await Promise.all([
    getToastFromSearchParams(searchParams),
    getServerCopy(),
    getServerLang(),
  ])
  const copy = adminSchedulingCopy[lang]
  const locale = getLocale(lang)
  const now = new Date()
  const [slots, meetings] = await Promise.all([
    prisma.meetingSlot.findMany({
      where: { startsAt: { gte: now } },
      include: { booking: true },
      orderBy: { startsAt: "asc" },
      take: 80,
    }),
    prisma.partnershipMeeting.findMany({
      include: { slot: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ])
  const available = slots.filter((slot) => slot.isActive && !slot.booking).length
  const reserved = slots.filter((slot) => slot.booking).length

  return (
    <main className="findb-shell relative min-h-screen overflow-hidden text-foreground">
      <ToastMessage type={toast?.type} message={toast?.message} />
      <div aria-hidden="true" className="brand-aurora pointer-events-none fixed inset-0 -z-20" />

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-3.5 pb-5 pt-6 min-[390px]:px-4 sm:px-6 lg:max-w-[720px]">
        <Link href="/admin" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-extrabold text-primary shadow-sm ring-1 ring-white/80 backdrop-blur transition hover:bg-white hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {copy.back}
        </Link>

        <section className="relative flex flex-col items-center text-center">
          <HeroWorldMap />
          <BrandLogo className="relative z-10 size-24 min-[390px]:size-28 sm:size-32" />

          <p className="relative z-10 mt-5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            {copy.eyebrow}
          </p>
          <h1 className="relative z-10 mt-2 font-display text-[2rem] font-extrabold leading-none tracking-normal text-balance min-[390px]:text-[2.25rem] sm:text-5xl">
            <span className="text-primary">{copy.titleStart}</span>{" "}
            <span className="text-accent">{copy.titleAccent}</span>
          </h1>
          <p className="relative z-10 mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {copy.description}
          </p>
        </section>

        <section className="grid gap-2.5 rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:grid-cols-3 sm:p-5">
          <Summary label={copy.released} value={slots.length} />
          <Summary label={copy.available} value={available} />
          <Summary label={copy.reserved} value={reserved} />
        </section>

        <MeetingSlotForm
          action={createMeetingSlot}
          labels={{
            formTitle: copy.formTitle,
            formDescription: copy.formDescription,
            date: copy.date,
            time: copy.time,
            duration: copy.duration,
            durationOptions: [
              { value: "15", label: copy.minutes(15) },
              { value: "30", label: copy.minutes(30) },
              { value: "45", label: copy.minutes(45) },
              { value: "60", label: copy.oneHour },
              { value: "90", label: copy.oneHourThirty },
            ],
            internalNote: copy.internalNote,
            optional: copy.optional,
            saving: copy.saving,
            createSlot: copy.createSlot,
          }}
        />

        <section className="grid gap-2.5">
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              {copy.nextSlotsEyebrow}
            </p>
            <h2 className="font-display text-xl font-extrabold text-primary">{copy.configuredSchedule}</h2>
          </div>

          {slots.length ? (
            slots.map((slot) => (
              <article key={slot.id} className="findb-link-card relative overflow-hidden rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:p-5">
                <span aria-hidden="true" className="findb-link-shine" />
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent min-[390px]:size-12">
                    <CalendarCheck2 className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill label={slot.booking ? copy.reservedStatus : slot.isActive ? copy.availableStatus : copy.inactiveStatus} />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-extrabold leading-tight text-primary capitalize">
                      {formatDateLong(slot.startsAt, locale)}
                    </h3>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                      {copy.fromTo(formatTime(slot.startsAt, locale), formatTime(slot.endsAt, locale))}
                    </p>
                    {slot.note && (
                      <p className="mt-2 rounded-lg bg-primary/5 px-3 py-2 text-[11px] font-bold leading-relaxed text-primary/75">
                        {slot.note}
                      </p>
                    )}
                  </div>
                </div>

                {!slot.booking && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <ConfirmActionDialog
                      id={`toggle-${slot.id}`}
                      action={toggleMeetingSlot.bind(null, slot.id)}
                      trigger={slot.isActive ? copy.deactivate : copy.activate}
                      icon={<Power className="size-4" aria-hidden="true" />}
                      title={slot.isActive ? copy.deactivateSlotTitle : copy.activateSlotTitle}
                      subject={formatMeetingRange(slot.startsAt, slot.endsAt, locale)}
                      description={slot.isActive ? copy.deactivateSlotDescription : copy.activateSlotDescription}
                      closeLabel={c.common.close}
                      cancelLabel={c.common.cancel}
                      confirmLabel={slot.isActive ? copy.confirmDeactivate : copy.confirmActivate}
                    />
                    <ConfirmActionDialog
                      id={`delete-${slot.id}`}
                      action={deleteMeetingSlot.bind(null, slot.id)}
                      trigger={copy.delete}
                      icon={<Trash2 className="size-4" aria-hidden="true" />}
                      title={copy.deleteSlotTitle}
                      subject={formatMeetingRange(slot.startsAt, slot.endsAt, locale)}
                      description={copy.deleteSlotDescription}
                      closeLabel={c.common.close}
                      cancelLabel={c.common.cancel}
                      confirmLabel={c.common.confirmDelete}
                      triggerClassName="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-accent/10 px-4 text-xs font-extrabold text-accent ring-1 ring-accent/12 transition hover:bg-accent hover:text-white"
                      confirmClassName="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-accent px-4 text-xs font-extrabold text-white transition hover:bg-primary"
                    />
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-[1.2rem] bg-white/88 p-5 text-center text-sm font-bold text-muted-foreground ring-1 ring-white/90">
              {copy.noFutureSlots}
            </div>
          )}
        </section>

        <section className="grid gap-2.5">
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              {copy.requestsEyebrow}
            </p>
            <h2 className="font-display text-xl font-extrabold text-primary">{copy.scheduledMeetings}</h2>
          </div>

          {meetings.length ? (
            meetings.map((meeting) => (
              <article key={meeting.id} className="rounded-[1.15rem] bg-white/88 p-3 shadow-[0_10px_24px_-18px_rgba(33,33,156,0.45)] ring-1 ring-white/80 backdrop-blur min-[390px]:rounded-[1.2rem] min-[390px]:p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/5 text-primary min-[390px]:size-12">
                    <UserRound className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill label={meeting.status === "CANCELED" ? c.common.canceled : c.common.approved} />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-extrabold leading-tight text-primary">
                      {meeting.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                      {formatMeetingRange(meeting.slot.startsAt, meeting.slot.endsAt, locale)}
                    </p>
                    <div className="mt-3 grid gap-2 text-xs font-bold leading-relaxed text-primary/80">
                      <span className="inline-flex min-w-0 items-center gap-2 break-words">
                        <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" />
                        {meeting.email}
                      </span>
                      <span className="inline-flex min-w-0 items-center gap-2 break-words">
                        <MessageCircle className="size-4 shrink-0 text-accent" aria-hidden="true" />
                        {meeting.whatsapp} · {meeting.country}
                      </span>
                    </div>
                    {(meeting.company || meeting.message) && (
                      <p className="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-[11px] font-bold leading-relaxed text-primary/75">
                        {[meeting.company, meeting.message].filter(Boolean).join(" - ")}
                      </p>
                    )}
                  </div>
                </div>
                {meeting.status !== "CANCELED" && (
                  <div className="mt-3">
                    <ConfirmActionDialog
                      id={`cancel-${meeting.id}`}
                      action={cancelPartnershipMeeting.bind(null, meeting.id)}
                      trigger={copy.cancelMeeting}
                      icon={<XCircle className="size-4" aria-hidden="true" />}
                      title={copy.cancelMeetingTitle}
                      subject={meeting.name}
                      description={copy.cancelMeetingDescription}
                      closeLabel={c.common.close}
                      cancelLabel={c.common.cancel}
                      confirmLabel={copy.confirmCancelMeeting}
                      triggerClassName="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-accent/10 px-4 text-xs font-extrabold text-accent ring-1 ring-accent/12 transition hover:bg-accent hover:text-white"
                      confirmClassName="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-accent px-4 text-xs font-extrabold text-white transition hover:bg-primary"
                    />
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-[1.2rem] bg-white/88 p-5 text-center text-sm font-bold text-muted-foreground ring-1 ring-white/90">
              {copy.noMeetings}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function getLocale(lang: ServerLang) {
  const localeByLang: Record<ServerLang, string> = {
    ptBr: "pt-BR",
    ptPt: "pt-PT",
    en: "en",
    es: "es",
    fr: "fr",
  }

  return localeByLang[lang]
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-[0.9rem] bg-primary/5 px-3 py-2 text-left ring-1 ring-primary/6">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-accent shadow-[0_8px_18px_-16px_rgba(33,33,156,0.6)]">
        <Clock3 className="size-4" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
        <span className="block font-display text-sm font-extrabold leading-tight text-primary">{value}</span>
      </span>
    </div>
  )
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-primary ring-1 ring-primary/8">
      {label}
    </span>
  )
}

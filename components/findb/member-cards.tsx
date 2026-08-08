"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const memberCardSlides = [
  {
    id: "comunidade",
    title: "Comunidade",
    description: "Acesso às comunidades brasileiras por país",
    tone: "from-[#ff7a4f] to-[#ffd93d]",
    front: "/images/cartao-comunidade-frente.jpg",
    back: "/images/cartao-comunidade-costa.jpg",
  },
  {
    id: "cupido",
    title: "Cupido e Anfitrião",
    description: "Conexões, anfitriões e afiliados FindB",
    tone: "from-[#242039] to-[#d6b66d]",
    front: "/images/cartao-cupido-frente.jpg",
    back: "/images/cartao-cupido-costa.jpg",
  },
  {
    id: "minha-casa",
    title: "Minha Casa Virtual",
    description: "Moradias, acessos e suporte local",
    tone: "from-[#7b6ed6] to-[#5d8bd9]",
    front: "/images/cartao-minha-casa-frente.jpg",
    back: "/images/cartao-minha-casa-costa.jpg",
  },
  {
    id: "networking",
    title: "Networking e Negócios",
    description: "Empresas, projetos e oportunidades",
    tone: "from-[#3958ce] to-[#7d62e6]",
    front: "/images/cartao-networking-frente.jpg",
    back: "/images/cartao-networking-costa.jpg",
  },
  {
    id: "parceiros",
    title: "Parceiros Certificados",
    description: "Benefícios, parcerias e serviços verificados",
    tone: "from-[#12b98d] to-[#54dbbd]",
    front: "/images/cartao-parceiros-frente.jpg",
    back: "/images/cartao-parceiros-costa.jpg",
  },
  {
    id: "relacionamento",
    title: "Relacionamento",
    description: "Comunidade, encontros e conexões saudáveis",
    tone: "from-[#6d35a8] to-[#ee337b]",
    front: "/images/cartao-relacionamento-frente.jpg",
    back: "/images/cartao-relacionamento-costa.jpg",
  },
]

export function MemberCards() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [side, setSide] = useState<"front" | "back">("front")
  const [interactionKey, setInteractionKey] = useState(0)
  const [navigationLocked, setNavigationLocked] = useState(false)
  const autoTimerRef = useRef<number | null>(null)
  const navigationLockRef = useRef(false)
  const navigationLockTimerRef = useRef<number | null>(null)
  const thumbnailRailRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeCard = memberCardSlides[activeIndex]

  function clearAutoTimer() {
    if (autoTimerRef.current) {
      window.clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }

  function lockNavigation() {
    navigationLockRef.current = true
    setNavigationLocked(true)

    if (navigationLockTimerRef.current) {
      window.clearTimeout(navigationLockTimerRef.current)
    }

    navigationLockTimerRef.current = window.setTimeout(() => {
      navigationLockRef.current = false
      setNavigationLocked(false)
      navigationLockTimerRef.current = null
    }, 420)
  }

  function registerManualInteraction() {
    clearAutoTimer()
    setInteractionKey((current) => current + 1)
  }

  function chooseSlide(index: number, manual = true) {
    setActiveIndex(index)
    setSide("front")

    if (manual) {
      registerManualInteraction()
    }
  }

  function goToNext() {
    if (navigationLockRef.current) {
      return
    }

    lockNavigation()
    registerManualInteraction()
    setActiveIndex((current) => (current + 1) % memberCardSlides.length)
    setSide("front")
  }

  function goToPrevious() {
    if (navigationLockRef.current) {
      return
    }

    lockNavigation()
    registerManualInteraction()
    setActiveIndex((current) => (current - 1 + memberCardSlides.length) % memberCardSlides.length)
    setSide("front")
  }

  useEffect(() => {
    clearAutoTimer()

    autoTimerRef.current = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % memberCardSlides.length)
      setSide("front")
    }, 5200)

    return clearAutoTimer
  }, [activeIndex, interactionKey])

  useEffect(() => {
    return () => {
      clearAutoTimer()

      if (navigationLockTimerRef.current) {
        window.clearTimeout(navigationLockTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const rail = thumbnailRailRef.current
    const thumbnail = thumbnailRefs.current[activeIndex]

    if (!rail || !thumbnail) {
      return
    }

    const railCenter = rail.clientWidth / 2
    const thumbnailCenter = thumbnail.offsetLeft + thumbnail.offsetWidth / 2
    const maxScroll = rail.scrollWidth - rail.clientWidth
    const nextScroll = Math.min(Math.max(thumbnailCenter - railCenter, 0), maxScroll)

    rail.scrollTo({
      left: nextScroll,
      behavior: "smooth",
    })
  }, [activeIndex])

  return (
    <section id="cartoes" aria-labelledby="cartoes-title" className="scroll-mt-6">
      <div className="member-showcase relative overflow-hidden rounded-[1.2rem] bg-white/88 p-3 shadow-[0_18px_45px_-30px_rgba(33,33,156,0.72)] ring-1 ring-white/90 backdrop-blur min-[390px]:rounded-[1.35rem] min-[390px]:p-4 sm:p-5">
        <div aria-hidden="true" className={`member-showcase-glow bg-gradient-to-br ${activeCard.tone}`} />

        <div className="relative flex items-center justify-between gap-3 px-1 pb-3">
          <div>
            <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-accent min-[390px]:text-[10px]">
              Identidade digital FindB
            </p>
            <h2
              id="cartoes-title"
              className="font-display text-lg font-extrabold tracking-normal text-primary min-[390px]:text-xl sm:text-2xl"
            >
              Cartões de acesso
            </h2>
          </div>
          <a
            href="#"
            className="shrink-0 rounded-full bg-primary px-3 py-2 text-[10px] font-bold text-white shadow-[0_12px_24px_-16px_rgba(33,33,156,0.9)] transition hover:bg-accent min-[390px]:text-[11px]"
          >
            Solicitar cartão
          </a>
        </div>

        <div className="relative">
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="member-slide-stage relative grid aspect-[1.8/1] place-items-center overflow-hidden rounded-[0.95rem] bg-white p-1.5 shadow-[0_22px_55px_-35px_rgba(33,33,156,0.9)] ring-1 ring-white/90 min-[390px]:rounded-[1.1rem] min-[390px]:p-2">
              <img
                key={`${activeCard.id}-${side}`}
                src={side === "front" ? activeCard.front : activeCard.back}
                alt={`Cartão ${activeCard.title} - ${side === "front" ? "frente" : "verso"}`}
                className="member-slide-image h-full w-full rounded-[0.7rem] object-contain min-[390px]:rounded-[0.85rem]"
                draggable={false}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <p className="font-display text-[15px] font-extrabold leading-tight text-primary min-[390px]:text-base">
                {activeCard.title}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                {activeCard.description}
              </p>
            </div>

            <div className="grid w-full grid-cols-[auto_minmax(7.75rem,1fr)_auto] gap-2 sm:w-auto">
              <button
                type="button"
                onClick={goToPrevious}
                disabled={navigationLocked}
                aria-label="Cartão anterior"
                className="grid size-9 place-items-center rounded-full bg-secondary text-primary transition hover:bg-white hover:text-accent hover:shadow-sm disabled:pointer-events-none disabled:opacity-60"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <div className="grid grid-cols-2 rounded-full bg-secondary p-1 text-[11px] font-bold text-primary">
                <button
                  type="button"
                  onClick={() => {
                    setSide("front")
                    setInteractionKey((current) => current + 1)
                  }}
                  className={`rounded-full px-3 py-1.5 transition ${
                    side === "front" ? "bg-white text-accent shadow-sm" : ""
                  }`}
                >
                  Frente
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSide("back")
                    setInteractionKey((current) => current + 1)
                  }}
                  className={`rounded-full px-3 py-1.5 transition ${
                    side === "back" ? "bg-white text-accent shadow-sm" : ""
                  }`}
                >
                  Verso
                </button>
              </div>

              <button
                type="button"
                onClick={goToNext}
                disabled={navigationLocked}
                aria-label="Próximo cartão"
                className="grid size-9 place-items-center rounded-full bg-secondary text-primary transition hover:bg-white hover:text-accent hover:shadow-sm disabled:pointer-events-none disabled:opacity-60"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={thumbnailRailRef}
            className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-1 py-1.5 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {memberCardSlides.map((card, index) => (
              <button
                key={card.id}
                ref={(node) => {
                  thumbnailRefs.current[index] = node
                }}
                type="button"
                onClick={() => chooseSlide(index)}
                aria-label={`Ver cartão ${card.title}`}
                className={`w-[82px] shrink-0 snap-center overflow-hidden rounded-[0.55rem] border-2 bg-white p-0.5 transition min-[390px]:w-[92px] sm:w-[98px] ${
                  activeIndex === index
                    ? "border-accent"
                    : "border-white/80 opacity-72 hover:opacity-100"
                }`}
              >
                <img
                  src={card.front}
                  alt=""
                  className="aspect-[1.58/1] w-full rounded-[0.4rem] object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

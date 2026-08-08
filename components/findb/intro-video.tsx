"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "findb-europa-intro-seen"

export function IntroVideo() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== "true") {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  function closeIntro() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // sessionStorage can be blocked in private modes; the intro still closes.
    }

    setClosing(true)
    window.setTimeout(() => setVisible(false), 420)
  }

  if (!visible) {
    return null
  }

  return (
    <div
      className={`intro-video fixed inset-0 z-50 grid place-items-center bg-background transition-opacity duration-500 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Vídeo de introdução FindB Europa"
      aria-modal="true"
    >
      <div aria-hidden="true" className="brand-aurora absolute inset-0" />
      <div className="relative grid h-full w-full place-items-center px-3 py-6 sm:px-6 sm:py-10">
        <video
          className="max-h-[82dvh] w-full max-w-[min(760px,calc(100vw-24px))] rounded-[1rem] object-contain shadow-[0_28px_90px_-42px_rgba(33,33,156,0.55)] ring-1 ring-white/70 sm:rounded-[1.35rem]"
          src="/videos/intro.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={closeIntro}
        />
      </div>
    </div>
  )
}

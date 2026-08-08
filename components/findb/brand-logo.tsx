export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={`brand-logo-stage relative ${className ?? ""}`}>
      <div aria-hidden="true" className="logo-halo absolute inset-[-18%] rounded-full" />
      <div aria-hidden="true" className="logo-ring absolute inset-[-8%] rounded-full" />
      <div aria-hidden="true" className="logo-ring logo-ring-alt absolute inset-[-1%] rounded-full" />

      <div className="brand-logo-disc relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/92 shadow-[0_28px_80px_-28px_rgba(33,33,156,0.72)] ring-1 ring-white/80 backdrop-blur-xl">
        <video
          src="/videos/intro.mp4"
          poster="/images/icone.png"
          className="h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          preload="metadata"
          aria-label="Logotipo animado FindB Europa"
        />
      </div>
    </div>
  )
}

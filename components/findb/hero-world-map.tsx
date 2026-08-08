export function HeroWorldMap() {
  return (
    <div className="hero-world-map" aria-hidden="true">
      <img
        src="/images/mapa-mundi-pontilhado.svg"
        alt=""
        className="hero-world-map-image"
        draggable={false}
      />

      <svg viewBox="0 0 740 493" role="presentation" className="hero-world-map-overlay">
        <defs>
          <linearGradient id="route-blue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand-navy)" stopOpacity="0" />
            <stop offset="48%" stopColor="var(--brand-pink)" stopOpacity="0.34" />
            <stop offset="100%" stopColor="var(--brand-navy)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="route-pink" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand-pink)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--brand-navy)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="var(--brand-pink)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="map-routes">
          <path d="M104 181 C 205 96, 300 105, 380 178" />
          <path d="M158 336 C 252 210, 325 150, 409 145" />
          <path d="M286 151 C 335 92, 386 84, 424 106" />
          <path d="M364 176 C 386 130, 406 112, 424 106" />
          <path d="M391 153 C 468 124, 560 134, 662 216" />
        </g>
      </svg>
    </div>
  )
}

const europePoints = [
  { id: "ie", x: 350, y: 133, tone: "blue" },
  { id: "pt", x: 364, y: 176, tone: "pink" },
  { id: "es", x: 380, y: 178, tone: "blue" },
  { id: "fr", x: 391, y: 153, tone: "pink" },
  { id: "uk", x: 379, y: 130, tone: "blue" },
  { id: "de", x: 409, y: 145, tone: "pink" },
  { id: "it", x: 417, y: 181, tone: "blue" },
  { id: "nl", x: 401, y: 135, tone: "blue" },
  { id: "se", x: 424, y: 106, tone: "pink" },
  { id: "pl", x: 430, y: 146, tone: "blue" },
  { id: "gr", x: 441, y: 198, tone: "pink" },
  { id: "fi", x: 451, y: 99, tone: "blue" },
  { id: "ro", x: 451, y: 166, tone: "pink" },
]

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

        <g className="map-points">
          {europePoints.map((point) => (
            <g
              key={point.id}
              className={`map-point europe-point ${
                point.tone === "pink" ? "point-pink" : "point-blue"
              }`}
            >
              <circle className="map-point-halo" cx={point.x} cy={point.y} r="8" />
              <circle className="map-point-core" cx={point.x} cy={point.y} r="4.2" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

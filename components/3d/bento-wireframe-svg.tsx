/**
 * Lightweight SVG wireframe — drop-in replacement for the R3F BentoWireframe.
 * Zero JS at runtime, zero WebGL contexts. Matches the visual language of the
 * design source. Use when LCP/TBT cost of the 3D Canvas isn't worth the gain.
 */
import type { CSSProperties, ReactElement } from 'react'

export type GeometryType =
  | 'icosahedron'
  | 'octahedron'
  | 'torus'
  | 'torusKnot'
  | 'dodecahedron'

interface Props {
  geometry?: GeometryType
  /** Use light (white) strokes for cards over the accent indigo bg. */
  accentColor?: boolean
  useGlass?: boolean
  /** Visual offset — kept for API parity with the 3D version. */
  position?: [number, number, number]
  className?: string
  style?: CSSProperties
}

const SHAPES: Record<GeometryType, ReactElement> = {
  icosahedron: (
    <g>
      <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" fill="none" />
      <polygon points="100,10 100,190 20,55 20,145" fill="none" />
      <polygon points="100,10 100,190 180,55 180,145" fill="none" />
      <line x1="100" y1="10"  x2="100" y2="190" />
      <line x1="20"  y1="55"  x2="180" y2="55"  />
      <line x1="20"  y1="145" x2="180" y2="145" />
      <line x1="20"  y1="55"  x2="180" y2="145" />
      <line x1="180" y1="55"  x2="20"  y2="145" />
    </g>
  ),
  torus: (
    <g>
      <ellipse cx="100" cy="100" rx="80" ry="38" fill="none" />
      <ellipse cx="100" cy="100" rx="80" ry="14" fill="none" />
      <ellipse cx="100" cy="100" rx="40" ry="14" fill="none" />
      <ellipse cx="100" cy="100" rx="56" ry="22" fill="none" opacity="0.6" />
    </g>
  ),
  torusKnot: (
    <g>
      <path d="M40,100 C 60,30 140,30 160,100 C 180,170 100,170 60,100 C 40,40 140,40 170,100" fill="none" />
      <path d="M30,100 C 80,170 120,170 180,100 C 130,30 80,30 30,100" fill="none" opacity="0.7" />
    </g>
  ),
  octahedron: (
    <g>
      <polygon points="100,15 180,100 100,185 20,100" fill="none" />
      <line x1="100" y1="15"  x2="100" y2="185" />
      <line x1="20"  y1="100" x2="180" y2="100" />
    </g>
  ),
  dodecahedron: (
    <g>
      <polygon points="100,25 165,72 142,148 58,148 35,72" fill="none" />
      <polygon points="100,60 140,90 125,135 75,135 60,90" fill="none" />
      <line x1="100" y1="25" x2="100" y2="60"  />
      <line x1="165" y1="72" x2="140" y2="90"  />
      <line x1="142" y1="148" x2="125" y2="135" />
      <line x1="58" y1="148" x2="75" y2="135" />
      <line x1="35" y1="72" x2="60" y2="90" />
    </g>
  ),
}

export function BentoWireframe({
  geometry = 'icosahedron',
  accentColor = false,
  position = [0, 0, 0],
}: Props) {
  const stroke = accentColor
    ? 'rgba(255,255,255,0.7)'
    : 'color-mix(in oklab, var(--primary) 60%, transparent)'

  // Mimic the 3D scene's offset — moves the wireframe to the right/edge of the tile.
  const offsetX = position[0] * 24
  const offsetY = position[1] * 24

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <svg
        viewBox="0 0 200 200"
        className="w-[60%] h-[60%] opacity-80"
        style={{
          transform: `translate(${offsetX}%, ${offsetY}%)`,
          stroke,
          strokeWidth: 1.3,
        }}
      >
        {SHAPES[geometry] ?? SHAPES.icosahedron}
      </svg>
    </div>
  )
}

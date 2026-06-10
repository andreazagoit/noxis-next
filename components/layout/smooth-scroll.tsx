'use client'

import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

/**
 * Wheel smoothing on, classic buttery feel (lerp 0.1).
 * Se il "recupero" post-gesto sul trackpad torna a dare fastidio, alzare il
 * lerp (0.28 = quasi nativo, 1 = nativo).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        lerp: 0.1,
      }}
    >
      {children}
    </ReactLenis>
  )
}

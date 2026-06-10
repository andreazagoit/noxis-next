'use client'

import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

/**
 * TEMPORARY debug instrumentation for the "phantom snap at the end of the
 * scroll". Logs to the console:
 *  - [wheel]        every wheel event (watch the momentum tail after lift-off)
 *  - [scroll]       per-frame position while moving
 *  - [scroll-debug] WARN with 30 frames of context when it detects a
 *                   direction reversal or an abnormal jump between frames
 * Remove this component (and its mount in site-providers) when done.
 *
 * VERBOSE off keeps only the WARN events: the per-frame [scroll]/[wheel]
 * logs go through the DevTools hook and log forwarding, and are expensive
 * enough to cause the very slow frames being measured (observer effect).
 */
const VERBOSE = false

export function ScrollDebugger() {
  const lenis = useLenis()

  useEffect(() => {
    type Sample = {
      t: number
      dt: number
      y: number
      d: number
      vel: number
      target: number
      anim: number
      scrolling: boolean | string
    }
    const buf: Sample[] = []
    let prevY = window.scrollY
    let prevD = 0
    let prevT = performance.now()
    let raf = 0

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight

    const onWheel = (e: WheelEvent) => {
      if (!VERBOSE) return
      // eslint-disable-next-line no-console
      console.log('[wheel]', Math.round(performance.now()), 'dY', +e.deltaY.toFixed(1))
    }
    window.addEventListener('wheel', onWheel, { passive: true })

    const loop = () => {
      const now = performance.now()
      const dt = now - prevT
      prevT = now
      const y = window.scrollY
      const d = y - prevY
      const sample: Sample = {
        t: Math.round(now),
        dt: +dt.toFixed(1),
        y: +y.toFixed(1),
        d: +d.toFixed(1),
        vel: +(lenis?.velocity ?? 0).toFixed(2),
        target: +(lenis?.targetScroll ?? -1).toFixed(1),
        anim: +(lenis?.animatedScroll ?? -1).toFixed(1),
        scrolling: lenis?.isScrolling ?? 'n/d',
      }
      buf.push(sample)
      if (buf.length > 30) buf.shift()

      const reversal = prevD * d < 0 && Math.abs(d) > 3 && Math.abs(prevD) > 3
      const spike = Math.abs(d) > Math.abs(prevD) * 2 + 30
      const slowFrame = dt > 34 // more than ~2 frames at 60Hz
      if (reversal || spike || (slowFrame && Math.abs(d) > 0.5)) {
        // eslint-disable-next-line no-console
        console.warn(
          `[scroll-debug] ${reversal ? 'INVERSIONE' : spike ? 'SCATTO' : 'FRAME LENTO'}`,
          {
            dtMs: +dt.toFixed(1),
            d: +d.toFixed(1),
            prevD: +prevD.toFixed(1),
            y: +y.toFixed(1),
            distanzaDalFondo: +(maxScroll() - y).toFixed(1),
            ultimiFrame: [...buf],
          },
        )
      }
      if (VERBOSE && Math.abs(d) > 0.5) {
        // eslint-disable-next-line no-console
        console.log('[scroll]', sample)
      }

      if (d !== 0) prevD = d
      prevY = y
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel)
    }
  }, [lenis])

  return null
}

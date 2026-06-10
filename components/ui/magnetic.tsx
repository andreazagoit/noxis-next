'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const SPRING = { stiffness: 150, damping: 15, mass: 0.1 }

export default function Magnetic({ children }: { children: React.ReactElement }) {
  const ref = useRef<HTMLDivElement>(null)
  // Rect cached on enter + motion values instead of setState: mousemove
  // triggers neither a forced reflow nor a React re-render.
  const rectRef = useRef<DOMRect | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  const handleEnter = () => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null
  }

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rectRef.current
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.15)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.15)
  }

  const reset = () => {
    rectRef.current = null
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{ position: 'relative', x: springX, y: springY }}
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}

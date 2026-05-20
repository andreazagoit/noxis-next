'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function Magnetic({ children }: { children: React.ReactElement }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const rect = ref.current?.getBoundingClientRect() ?? {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    }
    const middleX = clientX - (rect.left + rect.width / 2)
    const middleY = clientY - (rect.top + rect.height / 2)
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 })
  }

  const reset = () => setPosition({ x: 0, y: 0 })

  return (
    <motion.div
      style={{ position: 'relative' }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={position}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

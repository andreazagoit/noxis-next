'use client'

import { motion, useInView, useAnimation, type HTMLMotionProps } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  width?: 'fit-content' | '100%'
  height?: 'fit-content' | '100%'
  delay?: number
  duration?: number
  yOffset?: number
  overflowVisible?: boolean
}

/* Kill-switch: true = niente animazioni d'ingresso, render statico. */
const DISABLED = false

export const Reveal = ({
  children,
  width = 'fit-content',
  height,
  delay = 0.25,
  duration = 0.5,
  yOffset = 20,
  className,
  overflowVisible = false,
  ...props
}: RevealProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible')
    }
  }, [isInView, mainControls])

  if (DISABLED) {
    return (
      <div style={{ position: 'relative', width, height }} className={className}>
        <div style={{ height: height === '100%' ? '100%' : undefined }}>{children}</div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width,
        height,
        overflow: overflowVisible ? 'visible' : 'hidden',
      }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: yOffset },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay, ease: 'easeOut' }}
        // When the wrapper is asked to fill the grid cell, the animated inner
        // div must fill it too, so h-full cards align across the row.
        style={{ height: height === '100%' ? '100%' : undefined }}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  )
}

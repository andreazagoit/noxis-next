'use client'

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { Container } from '@/components/layout/container'
import { Typography } from '@/components/ui/typography'

const ITEMS = [
  { key: 'strategy', tag: '01', title: 'Strategy', sub: 'Positioning, goals, channel mix.', accent: 'oklch(0.4357 0.289 264.18)' },
  { key: 'research', tag: '02', title: 'Research', sub: 'Audience, benchmark, creator mapping.', accent: 'oklch(0.145 0 0)' },
  { key: 'production', tag: '03', title: 'Production', sub: 'Concept, scrittura, direzione, editing.', accent: 'rgb(43,46,58)' },
  { key: 'management', tag: '04', title: 'Management', sub: 'Brief, contratti, calendario.', accent: 'oklch(0.4357 0.289 264.18)' },
  { key: 'protection', tag: '05', title: 'Protection', sub: 'Vetting creator, content review.', accent: 'oklch(0.145 0 0)' },
  { key: 'campaign', tag: '06', title: 'Campaign', sub: 'Esecuzione end-to-end, live monitoring.', accent: 'rgb(43,46,58)' },
]

export function TalentCapabilitiesHover() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 240, damping: 24, mass: 0.5 })
  const py = useSpring(my, { stiffness: 240, damping: 24, mass: 0.5 })

  const handleMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setActive(null)}
      className="relative bg-background overflow-hidden"
    >
      <Container className="py-section">
        <div className="flex flex-col gap-4 mb-12 md:mb-16 md:max-w-3xl">
          <Typography variant="caption" className="!text-primary">
            Capabilities
          </Typography>
          <Typography variant="display">
            Una squadra,{' '}
            <span className="text-primary">tutta la campagna.</span>
          </Typography>
        </div>

        <ul className="relative border-t border-foreground/15">
          {ITEMS.map((item, i) => {
            const isActive = active === i
            return (
              <li
                key={item.key}
                onMouseEnter={() => setActive(i)}
                className="relative border-b border-foreground/15 group cursor-pointer"
              >
                <div className="flex items-center justify-between gap-6 py-6 md:py-8">
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className="font-heading text-xs md:text-sm text-foreground/40 w-8">
                      {item.tag}
                    </span>
                    <motion.span
                      animate={{ x: isActive ? 16 : 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="font-heading text-3xl md:text-6xl leading-none uppercase tracking-tight"
                    >
                      {item.title}
                    </motion.span>
                  </div>
                  <motion.span
                    animate={{ x: isActive ? -16 : 0, opacity: isActive ? 1 : 0.4 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden md:inline text-sm text-foreground/60 max-w-xs text-right"
                  >
                    {item.sub}
                  </motion.span>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>

      <motion.div
        style={{
          x: px,
          y: py,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none absolute top-0 left-0 z-10"
      >
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={ITEMS[active].key}
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundColor: ITEMS[active].accent }}
              className="hidden md:flex w-[28rem] h-[18rem] rounded-3xl items-center justify-center p-8 text-white"
            >
              <span className="font-heading text-5xl uppercase tracking-tight leading-none text-center">
                {ITEMS[active].title}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

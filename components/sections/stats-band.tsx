'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'

interface StatItem {
  value: number
  suffix: string
  label: string
}

function CountUp({ value, suffix, started }: { value: number; suffix: string; started: boolean }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!started) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [started, value])
  return (
    <span className="font-display text-6xl md:text-7xl leading-none text-foreground tabular-nums">
      {display}
      <span className="text-primary">{suffix}</span>
    </span>
  )
}

export function StatsBand() {
  const t = useTranslations()
  const items = t.raw('stats.items') as StatItem[]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <Reveal width="100%">
          <div
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-foreground/[0.07] lg:divide-x rounded-3xl border border-foreground/[0.07] bg-card shadow-[0_1px_2px_oklch(0.145_0_0/0.03),0_12px_32px_-16px_oklch(0.145_0_0/0.10)]"
          >
            {items.map((item, i) => (
              <div key={i} className="flex flex-col gap-4 p-8 md:p-10">
                <CountUp value={item.value} suffix={item.suffix} started={inView} />
                <p className="text-sm leading-relaxed text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

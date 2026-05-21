'use client'

import { motion, useScroll, type MotionValue, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Container } from '@/components/layout/container'

const TEXT =
  "Crediamo che ogni brand abbia una storia che merita la voce giusta. Selezioniamo creator come si selezionano collaboratori: per fit, per cultura, per intenzione."

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  return (
    <span className="relative mr-[0.25em] inline-block overflow-hidden align-baseline">
      {/* ghost copy keeps layout while masked copy reveals on top */}
      <span aria-hidden className="text-foreground/10">{word}</span>
      <MaskedWord word={word} progress={progress} range={range} />
    </span>
  )
}

function MaskedWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const y = useTransform(progress, range, ['100%', '0%'])
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <motion.span
      style={{ y, opacity }}
      className="absolute inset-0 inline-block text-foreground"
    >
      {word}
    </motion.span>
  )
}

export function TalentWordReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.25'] })

  const words = TEXT.split(' ')

  return (
    <section ref={ref} className="relative">
      <Container className="py-section">
        <p className="font-heading uppercase leading-[1.05] tracking-tight text-3xl md:text-5xl lg:text-6xl max-w-5xl">
          {words.map((w, i) => {
            const start = i / words.length
            const end = Math.min(start + 1.5 / words.length, 1)
            return <Word key={i} word={w} progress={scrollYProgress} range={[start, end]} />
          })}
        </p>
      </Container>
    </section>
  )
}

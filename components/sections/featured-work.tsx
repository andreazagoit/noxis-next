'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

interface Stage {
  id: string
  title: string
  description: string
  items: string[]
}

const STEP_KEYS = ['discovery', 'concept', 'design', 'develop', 'polish', 'launch'] as const

export function FeaturedWork() {
  const t = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)

  const PROCESS_STEPS: Stage[] = STEP_KEYS.map((key, i) => ({
    id: String(i + 1).padStart(2, '0'),
    title: t(`methodology.steps.${key}.title`),
    description: t(`methodology.steps.${key}.description`),
    items: t.raw(`methodology.steps.${key}.items`) as string[],
  }))

  return (
    <section
      ref={containerRef}
      className="relative py-48 md:py-64 bg-primary overflow-hidden"
      id="methodology"
    >
      <Container>
        <div className="flex flex-col items-center mb-32 text-center">
          <Reveal width="100%">
            <div className="flex flex-col items-center">
              <Typography
                variant="caption"
                className="mb-4 !text-primary-foreground/70"
              >
                {t('methodology.subtitle')}
              </Typography>
              <Typography
                variant="display"
                className="!text-primary-foreground"
              >
                {t('methodology.title_prefix')}
                <span>{t('methodology.title_main')}</span>
                <span className="opacity-30">.</span>
              </Typography>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <div className="space-y-8 md:space-y-24 relative">
            {PROCESS_STEPS.map((step, index) => (
              <TimelineStep
                key={step.id}
                step={step}
                index={index}
                isLast={index === PROCESS_STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function TimelineStep({
  step,
  index,
  isLast,
}: {
  step: Stage
  index: number
  isLast: boolean
}) {
  const isEven = index % 2 === 1

  return (
    <div
      className={cn(
        'relative flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-0 pl-16 md:pl-0',
        isEven ? 'md:flex-row-reverse' : '',
      )}
    >
      <div className="absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        <motion.div
          className="absolute w-6 h-6 rounded-full bg-primary-foreground"
          animate={{ scale: [0.5, 1.2, 1.8], opacity: [0, 0.4, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: index * 0.3,
          }}
        />
        <div className="w-3 h-3 rounded-full bg-primary-foreground relative z-10" />
      </div>

      {!isLast && (
        <div className="absolute left-4 md:left-1/2 top-1/2 w-[1px] bg-primary-foreground/40 -translate-x-1/2 h-[calc(100%+2rem)] md:h-[calc(100%+6rem)] z-0" />
      )}

      <div className="w-full md:w-[46%] group">
        <Reveal width="100%" delay={0.1} yOffset={40}>
          <GlassCard>
            <span className="absolute top-6 right-8 font-heading text-[5rem] md:text-[7rem] leading-none text-white/20 group-hover:text-white/40 transition-colors duration-300 select-none">
              {step.id}
            </span>

            <div className="relative z-10">
              <Typography
                variant="h3"
                className="!text-white mb-3"
              >
                {step.title}
              </Typography>

              <Typography variant="body" className="!text-white/90 mb-6">
                {step.description}
              </Typography>

              <div className="flex flex-wrap gap-2">
                {step.items.map((item) => (
                  <GlassBadge key={item}>{item}</GlassBadge>
                ))}
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>

      <div className="hidden md:block w-[46%]" />
    </div>
  )
}

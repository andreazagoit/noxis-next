'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { WordReveal } from '@/components/ui/word-reveal'
import { cn } from '@/lib/utils'

const TOP_COUNT = 4
const BOTTOM_COUNT = 4

function PlaceholderTile({ big = false }: { big?: boolean }) {
  const t = useTranslations()
  return (
    <div className="relative h-full w-full rounded-3xl overflow-hidden border border-border bg-muted flex items-center justify-center p-6">
      <span
        className={cn(
          'font-heading font-bold uppercase tracking-tight text-muted-foreground/50 text-center',
          big ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl',
        )}
      >
        {t('talent.roster.placeholder')}
      </span>
    </div>
  )
}

function TileSlot({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={cn('h-full', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function TalentRoster() {
  const t = useTranslations()

  return (
    <section id="talent-roster" className="relative">
      <Container className="py-section">
        <div className="mb-12 md:mb-16">
          <Typography variant="display">
            <WordReveal text={t('talent.roster.title_line1')} />
            <br />
            <span className="text-primary">
              <WordReveal text={t('talent.roster.title_line2')} delay={0.15} />
            </span>
          </Typography>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
          style={{ gridAutoRows: 'minmax(280px, 1fr)' }}
        >
          <TileSlot className="col-span-2 row-span-2" delay={0}>
            <PlaceholderTile big />
          </TileSlot>
          {Array.from({ length: TOP_COUNT }).map((_, i) => (
            <TileSlot key={`top-${i}`} delay={0.05 + i * 0.05}>
              <PlaceholderTile />
            </TileSlot>
          ))}
          {Array.from({ length: BOTTOM_COUNT }).map((_, i) => (
            <TileSlot key={`bottom-${i}`} delay={0.1 + i * 0.05}>
              <PlaceholderTile />
            </TileSlot>
          ))}
        </div>
      </Container>
    </section>
  )
}

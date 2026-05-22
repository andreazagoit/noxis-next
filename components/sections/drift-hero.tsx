'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/layout/container'
import { DotButton } from '@/components/ui/dot-button'
import { Typography } from '@/components/ui/typography'
import { BrandSlider } from '@/components/ui/brand-slider'
import { WordReveal } from '@/components/ui/word-reveal'
import { cn } from '@/lib/utils'

interface DriftHeroProps {
  eyebrow?: string
  lines: [string, string, string]
  lead: string
  primaryCta: string
  onPrimaryClick?: () => void
  outlineCta?: string
  onOutlineClick?: () => void
  showBrands?: boolean
}

const EASE = [0.33, 1, 0.68, 1] as const

const LINE_OFFSETS = ['ml-0', 'md:ml-[18%]', 'md:ml-[6%]']

export function DriftHero({
  eyebrow,
  lines,
  lead,
  primaryCta,
  onPrimaryClick,
  outlineCta,
  onOutlineClick,
  showBrands = true,
}: DriftHeroProps) {
  return (
    <>
      <section className="relative w-full overflow-hidden pt-40 pb-28 md:pt-56 md:pb-36">
        {/* Floating indigo glass blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[5%] right-[8%] w-[480px] h-[480px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, color-mix(in oklab, var(--primary) 35%, white) 0%, color-mix(in oklab, var(--primary) 25%, transparent) 30%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[60%] left-[8%] w-[280px] h-[280px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--primary) 45%, white) 0%, color-mix(in oklab, var(--primary) 30%, transparent) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[30%] left-[40%] w-40 h-40 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, color-mix(in oklab, var(--primary) 60%, white) 0%, transparent 60%)',
            filter: 'blur(20px)',
          }}
        />

        <Container className="relative z-10">
          {eyebrow && (
            <div className="mb-8 overflow-hidden">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              >
                <Typography variant="caption" className="!text-primary">
                  {eyebrow}
                </Typography>
              </motion.div>
            </div>
          )}

          <Typography variant="hero" className="text-foreground">
            {(() => {
              const stagger = 0.07
              let wordCount = 0
              return lines.map((line, i) => {
                const startDelay = 0.2 + wordCount * stagger
                wordCount += line.split(' ').length
                return (
                  <div
                    key={i}
                    className={cn(
                      'block',
                      LINE_OFFSETS[i],
                      i === 1 ? 'text-primary' : undefined,
                    )}
                  >
                    <WordReveal
                      text={line}
                      delay={startDelay}
                      stagger={stagger}
                      duration={0.7}
                    />
                  </div>
                )
              })
            })()}
          </Typography>

          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <Typography variant="lead" className="md:max-w-xl">
              <WordReveal text={lead} delay={0.8} stagger={0.025} />
            </Typography>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <DotButton variant="primary" onClick={onPrimaryClick}>
                {primaryCta}
              </DotButton>
              {outlineCta && (
                <DotButton variant="outline" onClick={onOutlineClick}>
                  {outlineCta}
                </DotButton>
              )}
            </div>
          </div>
        </Container>
      </section>

      {showBrands && <BrandSlider />}
    </>
  )
}

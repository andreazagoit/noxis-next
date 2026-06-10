'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { CleanButton } from '@/components/ui/clean-button'
import { HeroVisual } from '@/components/sections/hero-visual'
import { useCheckDialog } from '@/components/check/check-dialog'

const EASE = [0.16, 1, 0.3, 1] as const

function FadeUp({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function CleanHero() {
  const t = useTranslations()
  const { openCheck } = useCheckDialog()
  return (
    <section className="relative overflow-hidden pt-44 md:pt-52 pb-24 md:pb-28">
      {/* Quiet depth: one warm glow + a fading engineering grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-12%] right-[-6%] h-[560px] w-[560px] rounded-full bg-primary/[0.09] blur-[130px]" />
        <div className="absolute top-[35%] left-[-10%] h-[380px] w-[380px] rounded-full bg-primary/[0.05] blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.04)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_-5%,black,transparent)]" />
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <div>
            <FadeUp delay={0}>
              <span className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <span aria-hidden className="h-px w-8 bg-primary/50" />
                {t('hero.eyebrow')}
              </span>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="text-[2.9rem] leading-[1.06] md:text-6xl md:leading-[1.04] font-semibold tracking-[-0.03em] text-foreground">
                {t('hero.title_line1')} {t('hero.title_line2')}{' '}
                <em className="font-display italic font-normal text-primary tracking-[-0.01em]">
                  {t('hero.title_line3')}
                </em>
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground">
                {t('hero.description')}
              </p>
            </FadeUp>
            <FadeUp delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-3.5">
                <CleanButton onClick={openCheck} arrow>
                  {t('hero.cta')}
                </CleanButton>
                <CleanButton variant="outline" href="/#pricing">
                  {t('hero.cta_secondary')}
                </CleanButton>
              </div>
            </FadeUp>
          </div>

          <HeroVisual />
        </div>
      </Container>
    </section>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { cardPremium } from '@/lib/styles'
import { cn } from '@/lib/utils'

const STEP_KEYS = ['discovery', 'concept', 'design', 'develop', 'polish', 'launch'] as const

export function Process() {
  const t = useTranslations()
  return (
    <section id="processo" className="py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow={t('methodology.subtitle')}
          title={t('methodology.title_prefix').trim()}
          accent={t('methodology.title_main')}
        />
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {STEP_KEYS.map((key, i) => (
            <Reveal key={key} width="100%" height="100%" delay={0.05 + i * 0.05}>
              <li className={cn(cardPremium, 'h-full rounded-3xl p-8 md:p-9')}>
                <span className="font-display block mb-5 text-3xl leading-none text-primary/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                  {t(`methodology.steps.${key}.title`)}
                </h3>
                <p className="text-sm leading-[1.7] text-muted-foreground">
                  {t(`methodology.steps.${key}.description`)}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}

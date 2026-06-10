'use client'

import { Check, GraduationCap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { cardPremium } from '@/lib/styles'
import { cn } from '@/lib/utils'

export function Training() {
  const t = useTranslations()
  const deliverables = t.raw('pricing.training.deliverables_list') as string[]
  return (
    <section id="formazione" className="pb-24 md:pb-32 scroll-mt-24">
      <Container>
        <SectionHeader
          eyebrow={t('pricing.training_section.eyebrow')}
          title={t('pricing.training_section.title')}
          accent={t('pricing.training_section.accent')}
          description={t('pricing.training_section.description')}
        />

        <Reveal width="100%" delay={0.08}>
          <article className={cn(cardPremium, 'rounded-3xl p-6 md:p-8')}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 lg:gap-10">
              <div>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/15">
                  <GraduationCap size={20} aria-hidden strokeWidth={1.75} />
                </div>
                <h3 className="mb-1.5 text-xl font-semibold tracking-tight text-foreground">
                  {t('pricing.training.name')}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                  {t('pricing.training.tagline')}
                </p>
                <div className="font-display text-2xl md:text-3xl leading-tight text-foreground">
                  {t('pricing.training.price')}
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 lg:pt-1">
                {deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={15} aria-hidden className="mt-0.5 shrink-0 text-primary" strokeWidth={2.5} />
                    <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-foreground/[0.07] pt-4">
              {(['timing', 'payment', 'for_whom'] as const).map((field) => (
                <div key={field} className="flex items-baseline gap-2 text-xs">
                  <dt className="font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {t(`pricing.${field}`)}
                  </dt>
                  <dd className="text-foreground/80">{t(`pricing.training.${field}_value`)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {t('pricing.training.note')}
            </p>
          </article>
        </Reveal>
      </Container>
    </section>
  )
}

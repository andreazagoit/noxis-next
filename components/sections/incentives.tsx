'use client'

import { Landmark, GraduationCap, Ticket } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { cardPremium } from '@/lib/styles'
import { cn } from '@/lib/utils'

const ICONS = [Landmark, GraduationCap, Ticket] as const

export function Incentives() {
  const t = useTranslations()
  const incentives = t.raw('pricing.incentives') as { title: string; text: string }[]
  return (
    <section id="incentivi" className="pb-24 md:pb-32">
      <Container>
        <SectionHeader
          title={t('pricing.incentives_title')}
          description={t('pricing.incentives_description')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-7">
          {incentives.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <Reveal key={i} width="100%" height="100%" delay={0.05 + i * 0.07}>
                  <div className={cn(cardPremium, 'h-full rounded-3xl p-8 md:p-9')}>
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/15">
                      <Icon size={22} aria-hidden strokeWidth={1.75} />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-[1.7] text-muted-foreground">{item.text}</p>
                  </div>
              </Reveal>
            )
          })}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground/80 max-w-2xl">
          {t('pricing.incentives_disclaimer')}
        </p>
      </Container>
    </section>
  )
}

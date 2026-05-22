'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { WordReveal } from '@/components/ui/word-reveal'

const ITEMS = ['matching', 'campaigns', 'tracking', 'reporting'] as const

export function TalentForBrands() {
  const t = useTranslations()

  return (
    <section id="talent-brands" className="relative">
      <Container className="py-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="flex flex-col gap-6">
            <Reveal width="100%">
              <Typography variant="caption" className="!text-primary">
                {t('talent.services.brand.eyebrow')}
              </Typography>
            </Reveal>

            <Typography variant="display">
              <WordReveal text={t('talent.services.brand.title')} delay={0.05} />
            </Typography>

            <Typography variant="lead">
              <WordReveal
                text={t('talent.for_brands.description')}
                delay={0.2}
                stagger={0.02}
              />
            </Typography>
          </div>

          <ul className="flex flex-col gap-6">
            {ITEMS.map((key, i) => (
              <Reveal key={key} width="100%" delay={0.1 + i * 0.08}>
                <li className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-2">
                  <Typography variant="h4">
                    {t(`talent.services.brand.items.${key}.title`)}
                  </Typography>
                  <Typography variant="body" className="text-muted-foreground">
                    {t(`talent.services.brand.items.${key}.description`)}
                  </Typography>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

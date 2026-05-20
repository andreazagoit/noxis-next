'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { DotCTAButton } from '@/components/ui/dot-cta-button'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'

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

            <Reveal width="100%" delay={0.05}>
              <Typography variant="display">
                {t('talent.services.brand.title')}
              </Typography>
            </Reveal>

            <Reveal width="100%" delay={0.1}>
              <Typography variant="lead">
                {t('talent.for_brands.description')}
              </Typography>
            </Reveal>

            <Reveal width="100%" delay={0.2} overflowVisible>
              <div className="mt-4">
                <DotCTAButton variant="primary" intent="talent_brand">
                  {t('talent.cta_brand')}
                </DotCTAButton>
              </div>
            </Reveal>
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

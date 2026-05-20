'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { CTAButton } from '@/components/ui/cta-button'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'

const ITEMS = ['management', 'deals', 'production', 'growth'] as const

export function TalentForCreators() {
  const t = useTranslations()

  return (
    <section id="talent-creators" className="relative bg-primary text-black py-section overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <ul className="flex flex-col gap-6 md:order-1 order-2">
            {ITEMS.map((key, i) => (
              <Reveal key={key} width="100%" delay={0.1 + i * 0.08}>
                <li className="rounded-3xl p-6 md:p-8 flex flex-col gap-2 bg-black/10 border border-black/10">
                  <Typography variant="h4" className="!text-black">
                    {t(`talent.services.creator.items.${key}.title`)}
                  </Typography>
                  <Typography variant="body" className="!text-black/80">
                    {t(`talent.services.creator.items.${key}.description`)}
                  </Typography>
                </li>
              </Reveal>
            ))}
          </ul>

          <div className="flex flex-col gap-6 md:order-2 order-1">
            <Reveal width="100%">
              <Typography variant="caption" className="!text-black/70">
                {t('talent.services.creator.eyebrow')}
              </Typography>
            </Reveal>

            <Reveal width="100%" delay={0.05}>
              <Typography variant="display" className="!text-black">
                {t('talent.services.creator.title')}
              </Typography>
            </Reveal>

            <Reveal width="100%" delay={0.1}>
              <Typography variant="lead" className="!text-black/80">
                {t('talent.for_creators.description')}
              </Typography>
            </Reveal>

            <Reveal width="100%" delay={0.2} overflowVisible>
              <div className="mt-4">
                <CTAButton variant="dark" intent="talent_creator">
                  {t('talent.cta_creator')}
                </CTAButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

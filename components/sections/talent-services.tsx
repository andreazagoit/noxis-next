'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'

const BRAND_ITEMS = ['matching', 'campaigns', 'tracking', 'reporting'] as const
const CREATOR_ITEMS = ['management', 'deals', 'production', 'growth'] as const

export function TalentServices() {
  const t = useTranslations()

  return (
    <section id="talent-services">
      <Container className="py-section">
        <Reveal width="100%" className="mb-element">
          <Typography variant="display" className="mb-element">
            {t('talent.services.title_line1')}{' '}
            <span className="text-primary">{t('talent.services.title_line2')}</span>
          </Typography>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-element">
          <Reveal width="100%">
            <div className="glass-panel rounded-3xl p-8 md:p-10 h-full flex flex-col gap-6">
              <div>
                <Typography variant="caption" className="text-primary mb-2">
                  {t('talent.services.brand.eyebrow')}
                </Typography>
                <Typography variant="h3">
                  {t('talent.services.brand.title')}
                </Typography>
              </div>
              <ul className="flex flex-col gap-4">
                {BRAND_ITEMS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <div>
                      <Typography variant="h4" className="mb-1">
                        {t(`talent.services.brand.items.${key}.title`)}
                      </Typography>
                      <Typography variant="body" className="text-muted-foreground">
                        {t(`talent.services.brand.items.${key}.description`)}
                      </Typography>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal width="100%" delay={0.1}>
            <div className="rounded-3xl p-8 md:p-10 h-full flex flex-col gap-6 bg-gradient-to-br from-primary/80 to-primary text-black">
              <div>
                <Typography variant="caption" className="!text-black/70 mb-2">
                  {t('talent.services.creator.eyebrow')}
                </Typography>
                <Typography variant="h3" className="!text-black">
                  {t('talent.services.creator.title')}
                </Typography>
              </div>
              <ul className="flex flex-col gap-4">
                {CREATOR_ITEMS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mt-2.5 shrink-0" />
                    <div>
                      <Typography variant="h4" className="mb-1 !text-black">
                        {t(`talent.services.creator.items.${key}.title`)}
                      </Typography>
                      <Typography variant="body" className="!text-black/80">
                        {t(`talent.services.creator.items.${key}.description`)}
                      </Typography>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

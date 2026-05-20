'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'

const STARTUP_ITEMS = ['mvp', 'design', 'launch', 'iterate'] as const
const ENTERPRISE_ITEMS = ['platforms', 'integrations', 'performance', 'support'] as const

export function DevelopmentServices() {
  const t = useTranslations()

  return (
    <section id="development-services">
      <Container className="py-section">
        <Reveal width="100%" className="mb-element">
          <Typography variant="display" className="mb-element">
            {t('development.services.title_line1')}{' '}
            <span className="text-primary">{t('development.services.title_line2')}</span>
          </Typography>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-element">
          <Reveal width="100%">
            <div className="glass-panel rounded-3xl p-8 md:p-10 h-full flex flex-col gap-6">
              <div>
                <Typography variant="caption" className="text-primary mb-2">
                  {t('development.services.startup.eyebrow')}
                </Typography>
                <Typography variant="h3">
                  {t('development.services.startup.title')}
                </Typography>
              </div>
              <ul className="flex flex-col gap-4">
                {STARTUP_ITEMS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <div>
                      <Typography variant="h4" className="mb-1">
                        {t(`development.services.startup.items.${key}.title`)}
                      </Typography>
                      <Typography variant="body" className="text-muted-foreground">
                        {t(`development.services.startup.items.${key}.description`)}
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
                  {t('development.services.enterprise.eyebrow')}
                </Typography>
                <Typography variant="h3" className="!text-black">
                  {t('development.services.enterprise.title')}
                </Typography>
              </div>
              <ul className="flex flex-col gap-4">
                {ENTERPRISE_ITEMS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mt-2.5 shrink-0" />
                    <div>
                      <Typography variant="h4" className="mb-1 !text-black">
                        {t(`development.services.enterprise.items.${key}.title`)}
                      </Typography>
                      <Typography variant="body" className="!text-black/80">
                        {t(`development.services.enterprise.items.${key}.description`)}
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

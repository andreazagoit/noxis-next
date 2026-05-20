'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { DotCTAButton } from '@/components/ui/dot-cta-button'
import { Typography } from '@/components/ui/typography'

export function Partnership() {
  const t = useTranslations()
  return (
    <section id="partner">
      <Container className="text-center py-section">
        <Reveal width="100%">
          <Typography variant="display" className="mb-element">
            {t('partnership.title_line1')}{' '}
            <span className="text-primary">{t('partnership.title_line2')}</span>?
          </Typography>
        </Reveal>

        <Reveal width="100%" delay={0.1}>
          <Typography variant="lead" className="mb-element max-w-3xl mx-auto">
            {t('partnership.description')}
          </Typography>
        </Reveal>

        <Reveal width="100%" delay={0.2} overflowVisible>
          <DotCTAButton variant="outline" intent="general">{t('partnership.cta')}</DotCTAButton>
        </Reveal>
      </Container>
    </section>
  )
}

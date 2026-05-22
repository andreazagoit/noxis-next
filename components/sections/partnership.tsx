'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { DotButton } from '@/components/ui/dot-button'
import { mailtoHref } from '@/lib/mailto'
import { Typography } from '@/components/ui/typography'
import { WordReveal } from '@/components/ui/word-reveal'

export function Partnership() {
  const t = useTranslations()
  return (
    <section id="partner">
      <Container className="text-center py-section">
        <Typography variant="display" className="mb-element">
          <WordReveal text={t('partnership.title_line1')} />{' '}
          <span className="text-primary">
            <WordReveal text={t('partnership.title_line2')} delay={0.15} />
          </span>
          ?
        </Typography>

        <Typography variant="lead" className="mb-element max-w-3xl mx-auto">
          <WordReveal
            text={t('partnership.description')}
            delay={0.3}
            stagger={0.02}
          />
        </Typography>

        <Reveal width="100%" delay={0.2} overflowVisible>
          <DotButton
            variant="outline"
            onClick={() => {
              window.location.href = mailtoHref(t, 'general')
            }}
          >
            {t('partnership.cta')}
          </DotButton>
        </Reveal>
      </Container>
    </section>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { WordReveal } from '@/components/ui/word-reveal'

export function Vision() {
  const t = useTranslations()
  return (
    <section id="manifesto" className="relative w-full py-section bg-background">
      <Container className="flex flex-col gap-32 md:gap-48">
        <div className="w-full py-24 md:py-32 flex flex-col items-center text-center gap-10">
          <div className="flex flex-col gap-10">
            <Typography variant="display" className="max-w-6xl mx-auto">
              <span className="text-foreground block mb-2">
                <WordReveal text={t('vision.quote_line1')} />
              </span>
              <span className="text-muted-foreground/50 block mb-8">
                <WordReveal text={t('vision.quote_line2')} delay={0.15} />
              </span>
            </Typography>
            <Typography variant="lead" className="max-w-3xl mx-auto">
              <WordReveal text={t('vision.quote_description')} delay={0.3} stagger={0.025} />
            </Typography>
          </div>
        </div>

        {(['vision', 'mission'] as const).map((key) => (
          <div
            key={key}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 items-start"
          >
            <div className="md:col-span-4">
              <Reveal delay={0.1}>
                <Typography variant="caption" className="text-primary mb-4 block">
                  {t(`vision.our_${key}`)}
                </Typography>
              </Reveal>
              <Typography
                variant="h2"
                className="leading-none whitespace-pre-line"
              >
                <WordReveal
                  text={t(`vision.${key}_title`)}
                  preserveLineBreaks
                  delay={0.15}
                />
              </Typography>
            </div>
            <div className="md:col-span-8 md:pl-12 pt-4">
              <Typography variant="lead">
                <WordReveal
                  text={t(`vision.${key}_description`)}
                  delay={0.3}
                  stagger={0.02}
                />
              </Typography>
            </div>
          </div>
        ))}
      </Container>
    </section>
  )
}

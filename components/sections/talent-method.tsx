'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { WordReveal } from '@/components/ui/word-reveal'

const STEPS = ['discovery', 'match', 'produce', 'measure'] as const

export function TalentMethod() {
  const t = useTranslations()

  return (
    <section id="talent-method" className="relative">
      <Container className="py-section">
        <div className="flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col gap-4 md:max-w-3xl">
            <Reveal width="100%">
              <Typography variant="caption" className="!text-primary">
                {t('talent.method.eyebrow')}
              </Typography>
            </Reveal>
            <Typography variant="display">
              <WordReveal text={t('talent.method.title_line1')} delay={0.05} />{' '}
              <span className="text-primary">
                <WordReveal text={t('talent.method.title_line2')} delay={0.2} />
              </span>
            </Typography>
            <Typography variant="lead" className="text-muted-foreground">
              <WordReveal
                text={t('talent.method.description')}
                delay={0.35}
                stagger={0.02}
              />
            </Typography>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="hidden md:block absolute left-0 right-0 top-[1.5rem] h-px bg-border"
            />
            <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 list-none">
              {STEPS.map((key, i) => (
                <motion.li
                  key={key}
                  className="relative flex flex-col gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.08, ease: 'easeOut' }}
                >
                  <div className="flex items-center gap-3 md:block">
                    <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background font-heading text-lg shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:pr-6">
                    <Typography variant="h4">
                      {t(`talent.method.steps.${key}.title`)}
                    </Typography>
                    <Typography variant="body" className="text-muted-foreground">
                      {t(`talent.method.steps.${key}.description`)}
                    </Typography>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}

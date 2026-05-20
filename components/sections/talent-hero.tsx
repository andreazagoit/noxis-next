'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { CTAButton } from '@/components/ui/cta-button'
import { Typography } from '@/components/ui/typography'
import { Reveal } from '@/components/ui/reveal'

export function TalentHero() {
  const t = useTranslations()

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-32 md:pt-40">
      <div
        className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2 z-[-1]"
        style={{
          background:
            'linear-gradient(to bottom, var(--border) 80%, transparent 100%)',
        }}
      />

      <Container className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="flex flex-col items-start gap-6">
          <Reveal width="100%">
            <Typography variant="caption" className="text-primary">
              {t('talent.eyebrow')}
            </Typography>
          </Reveal>

          <Typography variant="display" className="text-left text-foreground">
            {[1, 2, 3].map((line) => (
              <div key={line} className="overflow-hidden">
                <motion.div
                  className={line === 2 ? 'text-primary' : undefined}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.33, 1, 0.68, 1],
                    delay: 0.2 + line * 0.1,
                  }}
                >
                  {t(`talent.title_line${line}`)}
                </motion.div>
              </div>
            ))}
          </Typography>

          <Reveal width="100%" delay={0.4}>
            <Typography variant="lead" className="text-left md:max-w-[90%]">
              {t('talent.description')}
            </Typography>
          </Reveal>

          <Reveal width="100%" delay={0.5} overflowVisible>
            <div className="flex flex-wrap gap-3 mt-2">
              <CTAButton variant="primary" intent="talent_brand">{t('talent.cta_brand')}</CTAButton>
              <CTAButton variant="light" intent="talent_creator">{t('talent.cta_creator')}</CTAButton>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {(['matching', 'production', 'data', 'always_on'] as const).map((key, i) => (
            <Reveal key={key} width="100%" delay={0.3 + i * 0.08}>
              <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-2 h-full">
                <Typography variant="h4" className="!text-primary">
                  {t(`talent.highlights.${key}.title`)}
                </Typography>
                <Typography variant="body" className="text-muted-foreground">
                  {t(`talent.highlights.${key}.description`)}
                </Typography>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

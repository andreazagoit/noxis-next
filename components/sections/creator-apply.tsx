'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { DotButton } from '@/components/ui/dot-button'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { mailtoHref } from '@/lib/mailto'

const PERKS = ['manager', 'deals', 'production', 'growth'] as const

export function CreatorApply() {
  const t = useTranslations()

  return (
    <section id="creator-apply" className="relative">
      <Container className="py-section">
        <div className="mb-6 flex items-end justify-between gap-4">
          <Reveal width="100%" overflowVisible>
            <Typography variant="caption" className="!text-primary">
              {t('talent.apply.eyebrow')}
            </Typography>
          </Reveal>
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            {t('talent.apply.window')}
          </span>
        </div>

        <Reveal width="100%" overflowVisible>
          <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground grid grid-cols-1 md:grid-cols-12">
            <div
              aria-hidden
              className="absolute -right-40 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />

            <div className="relative md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/20">
              <Typography
                variant="h2"
                className="!text-primary-foreground mb-5"
              >
                {t('talent.apply.title_line1')}
                <br />
                <span className="text-primary-foreground/60">
                  {t('talent.apply.title_line2')}
                </span>
              </Typography>
              <Typography
                variant="body"
                className="!text-primary-foreground/80 mb-8 md:max-w-sm"
              >
                {t('talent.apply.description')}
              </Typography>
              <DotButton
                variant="outline"
                onClick={() => {
                  window.location.href = mailtoHref(t, 'talent_creator')
                }}
              >
                {t('talent.apply.cta')}
              </DotButton>
            </div>

            <div className="relative md:col-span-7 p-8 md:p-12">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {PERKS.map((key, i) => (
                  <li key={key}>
                    <span className="font-mono text-[11px] tracking-widest text-primary-foreground/55">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Typography
                      variant="h4"
                      className="!text-primary-foreground mt-2 mb-1.5"
                    >
                      {t(`talent.apply.perks.${key}.title`)}
                    </Typography>
                    <Typography variant="body" className="!text-primary-foreground/75">
                      {t(`talent.apply.perks.${key}.description`)}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

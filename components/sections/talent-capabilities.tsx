'use client'

import {
  Compass,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'

const ITEMS = [
  { key: 'strategy', Icon: Compass },
  { key: 'research', Icon: Search },
  { key: 'production', Icon: Palette },
  { key: 'management', Icon: Sparkles },
  { key: 'protection', Icon: ShieldCheck },
  { key: 'campaign', Icon: Megaphone },
] as const

export function TalentCapabilities() {
  const t = useTranslations()

  return (
    <section id="talent-capabilities" className="relative">
      <Container className="py-section">
        <div className="flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col gap-4 md:max-w-3xl">
            <Reveal width="100%">
              <Typography variant="caption" className="!text-primary">
                {t('talent.capabilities.eyebrow')}
              </Typography>
            </Reveal>
            <Reveal width="100%" delay={0.05}>
              <Typography variant="display">
                {t('talent.capabilities.title_line1')}{' '}
                <span className="text-primary">{t('talent.capabilities.title_line2')}</span>
              </Typography>
            </Reveal>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {ITEMS.map(({ key, Icon }, i) => (
              <Reveal key={key} width="100%" delay={0.05 + i * 0.06}>
                <li className="flex flex-col gap-4 rounded-3xl border border-border p-6 md:p-8 h-full transition-colors hover:border-foreground/30">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-primary">
                    <Icon size={22} aria-hidden />
                  </div>
                  <Typography variant="h4">
                    {t(`talent.capabilities.items.${key}.title`)}
                  </Typography>
                  <Typography variant="body" className="text-muted-foreground">
                    {t(`talent.capabilities.items.${key}.description`)}
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

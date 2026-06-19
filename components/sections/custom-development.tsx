'use client'

import {
  Rocket,
  TrendingUp,
  Sparkles,
  LifeBuoy,
  LayoutDashboard,
  Plug,
  Gauge,
  Handshake,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { cardStatic } from '@/lib/styles'
import { cn } from '@/lib/utils'

/* Sviluppo su misura: riusa la copy `development.*` (la pagina /development
   è stata assorbita nella landing). Punti di valore + cosa costruiamo. */
const HIGHLIGHTS = [
  { key: 'idea', Icon: Rocket },
  { key: 'scale', Icon: TrendingUp },
  { key: 'ai', Icon: Sparkles },
  { key: 'partner', Icon: LifeBuoy },
] as const

const BUILD = [
  { key: 'platforms', Icon: LayoutDashboard },
  { key: 'integrations', Icon: Plug },
  { key: 'performance', Icon: Gauge },
  { key: 'support', Icon: Handshake },
] as const

function Card({
  Icon,
  title,
  description,
  delay,
}: {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
  title: string
  description: string
  delay: number
}) {
  return (
    <Reveal width="100%" height="100%" delay={delay}>
      <article className={cn(cardStatic, 'h-full rounded-3xl p-6 md:p-7')}>
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/15">
          <Icon size={20} strokeWidth={1.75} aria-hidden />
        </div>
        <h3 className="mb-1.5 text-base font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </article>
    </Reveal>
  )
}

export function CustomDevelopment() {
  const t = useTranslations()
  return (
    <section id="sviluppo" className="py-24 md:py-32 scroll-mt-24">
      <Container>
        <SectionHeader
          eyebrow={t('development.eyebrow')}
          title={`${t('development.title_line1')} ${t('development.title_line2')}`}
          accent={t('development.title_line3')}
          description={t('development.description')}
        />

        {/* Punti di valore */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {HIGHLIGHTS.map(({ key, Icon }, i) => (
            <Card
              key={key}
              Icon={Icon}
              title={t(`development.highlights.${key}.title`)}
              description={t(`development.highlights.${key}.description`)}
              delay={0.05 + i * 0.05}
            />
          ))}
        </div>

        {/* Per Startup e Aziende — cosa costruiamo */}
        <div className="mt-14 md:mt-16">
          <div className="mb-7">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t('development.services.enterprise.eyebrow')}
            </span>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t('development.services.enterprise.title')}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {BUILD.map(({ key, Icon }, i) => (
              <Card
                key={key}
                Icon={Icon}
                title={t(`development.services.enterprise.items.${key}.title`)}
                description={t(`development.services.enterprise.items.${key}.description`)}
                delay={0.05 + i * 0.05}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

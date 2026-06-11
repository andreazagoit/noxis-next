'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { CleanButton } from '@/components/ui/clean-button'
import { cardStatic } from '@/lib/styles'
import { mailtoHref } from '@/lib/mailto'
import { cn } from '@/lib/utils'

const OFFER_KEYS = ['automation', 'audit', 'sprint'] as const
type OfferKey = (typeof OFFER_KEYS)[number]

/** Animated conic border that travels around the container (Moving Border-inspired).
    The 1.5px gutter has a static base tint so the card keeps the same resting
    border as its siblings; the orange arc travels on top of it. */
function MovingBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[1.55rem] p-[1.5px] bg-white/[0.07] shadow-[0_1px_0_oklch(1_0_0/0.04)_inset,0_16px_40px_-20px_oklch(0_0_0/0.8)]">
      <div
        aria-hidden
        className="absolute inset-[-100%] will-change-transform animate-[spin_9s_linear_infinite] motion-reduce:animate-none bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,oklch(0.705_0.213_47.6/0.85)_310deg,oklch(0.82_0.14_85/0.6)_330deg,transparent_360deg)]"
      />
      <div className="relative h-full rounded-[1.45rem] bg-card">{children}</div>
    </div>
  )
}

function OfferCard({ offerKey, highlighted }: { offerKey: OfferKey; highlighted: boolean }) {
  const t = useTranslations()
  const deliverables = t.raw(`pricing.${offerKey}.deliverables_list`) as string[]
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-3xl p-7 md:p-8',
        highlighted
          ? 'bg-[linear-gradient(160deg,oklch(0.705_0.213_47.6/0.06),transparent_50%)]'
          : cardStatic,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {t(`pricing.${offerKey}.name`)}
        </h3>
        {highlighted && (
          <span className="shrink-0 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1">
            {t('offers.badge_start')}
          </span>
        )}
      </div>
      {/* Le tre tagline sono scritte per stare su ~3 righe: la min-height
          riserva quelle righe così prezzo e CTA restano allineati tra card. */}
      <p className="text-sm leading-relaxed text-muted-foreground mb-7 min-h-[4.3rem]">
        {t(`pricing.${offerKey}.tagline`)}
      </p>

      <div className="font-display text-3xl md:text-[2.1rem] leading-none text-foreground">
        {t(`pricing.${offerKey}.price`)}
      </div>
      <p className="mt-2.5 text-xs text-muted-foreground mb-6">
        {t(`pricing.${offerKey}.terms`)}
      </p>

      {/* Stesso bottone grande dell'hero, identico su tutte e tre le card. */}
      <CleanButton
        href={mailtoHref(t, 'development')}
        variant={highlighted ? 'primary' : 'outline'}
        arrow
        className="w-full"
      >
        {t('pricing.card_cta')}
      </CleanButton>

      <ul className="mt-7 flex flex-col gap-2.5 border-t border-foreground/[0.07] pt-6">
        {deliverables.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check size={14} aria-hidden className="mt-1 shrink-0 text-primary" strokeWidth={2.5} />
            <span className="text-sm leading-relaxed text-foreground/85">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export function PricingOffers() {
  const t = useTranslations()
  return (
    <section id="pricing" className="py-24 md:py-32 scroll-mt-24">
      <Container>
        <SectionHeader
          eyebrow={t('pricing.eyebrow')}
          title={t('pricing.title_line1')}
          accent={t('pricing.title_line2')}
          description={t('pricing.description')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {OFFER_KEYS.map((key) => (
            <Reveal key={key} width="100%" height="100%" delay={0.08}>
              {key === 'automation' ? (
                <MovingBorder>
                  <OfferCard offerKey={key} highlighted />
                </MovingBorder>
              ) : (
                <OfferCard offerKey={key} highlighted={false} />
              )}
            </Reveal>
          ))}
        </div>

      </Container>
    </section>
  )
}

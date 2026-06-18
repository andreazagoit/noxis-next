'use client'

import { useTranslations } from 'next-intl'
import { CleanHero } from '@/components/sections/clean-hero'
import { BrandSlider } from '@/components/ui/brand-slider'
import { Marquee } from '@/components/ui/marquee'
import { ServicesGrid } from '@/components/sections/services-grid'
import { PricingOffers } from '@/components/sections/pricing-offers'
import { Incentives } from '@/components/sections/incentives'
import { About } from '@/components/sections/about'
import { Faq } from '@/components/sections/faq'

export function HomeContent() {
  const t = useTranslations()
  return (
    <div className="relative">
      <CleanHero />
      <BrandSlider label={t('brands.label')} />
      <ServicesGrid />
      <PricingOffers />
      <Incentives />
      <Marquee items={t.raw('quotes.items') as string[]} />
      <About />
      <Faq />
    </div>
  )
}

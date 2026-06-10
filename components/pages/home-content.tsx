'use client'

import { useTranslations } from 'next-intl'
import { CleanHero } from '@/components/sections/clean-hero'
import { Marquee } from '@/components/ui/marquee'
import { ServicesGrid } from '@/components/sections/services-grid'
import { PricingOffers } from '@/components/sections/pricing-offers'
import { Training } from '@/components/sections/training'
import { Incentives } from '@/components/sections/incentives'
import { About } from '@/components/sections/about'
import { Faq } from '@/components/sections/faq'

export function HomeContent() {
  const t = useTranslations()
  return (
    <div className="relative">
      <CleanHero />
      <Marquee items={t.raw('quotes.items') as string[]} />
      <ServicesGrid />
      <PricingOffers />
      <Training />
      <Incentives />
      <About />
      <Faq />
    </div>
  )
}

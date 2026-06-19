'use client'

import { useTranslations } from 'next-intl'
import { CleanHero } from '@/components/sections/clean-hero'
import { BrandSlider } from '@/components/ui/brand-slider'
import { Marquee } from '@/components/ui/marquee'
import { ServicesGrid } from '@/components/sections/services-grid'
import { UseCases } from '@/components/sections/use-cases'
import { CustomDevelopment } from '@/components/sections/custom-development'
import { PricingOffers } from '@/components/sections/pricing-offers'
import { About } from '@/components/sections/about'
import { Faq } from '@/components/sections/faq'

export function HomeContent() {
  const t = useTranslations()
  return (
    <div className="relative">
      <CleanHero />
      <BrandSlider label={t('brands.label')} />
      <ServicesGrid />
      <UseCases />
      <CustomDevelopment />
      <PricingOffers />
      <Marquee items={t.raw('quotes.items') as string[]} />
      <About />
      <Faq />
    </div>
  )
}

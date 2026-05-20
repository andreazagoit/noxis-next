'use client'

import { useTranslations } from 'next-intl'
import { Hero } from '@/components/sections/hero'
import { Vision } from '@/components/sections/vision'
import { Partnership } from '@/components/sections/partnership'
import { Services } from '@/components/sections/services'
import { FeaturedWork } from '@/components/sections/featured-work'
import { Quotes } from '@/components/sections/quotes'
import { MountainSeparator } from '@/components/ui/mountain-separator'

export default function Home() {
  const t = useTranslations()
  return (
    <div className="relative">
      <Hero />
      <Vision />
      <Partnership />
      <Services />

      <MountainSeparator topColor="bg-background" bottomColor="bg-primary" />
      <FeaturedWork />

      <MountainSeparator topColor="bg-primary" bottomColor="bg-background" />
      <Quotes
        items={t.raw('quotes.items') as string[]}
        backgroundColor="bg-background"
        textColor="text-foreground"
        className="mt-0"
      />
    </div>
  )
}

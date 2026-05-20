'use client'

import { DevelopmentHero } from '@/components/sections/development-hero'
import { DevelopmentServices } from '@/components/sections/development-services'
import { Partnership } from '@/components/sections/partnership'

export default function DevelopmentPage() {
  return (
    <div className="relative">
      <DevelopmentHero />
      <DevelopmentServices />
      <Partnership />
    </div>
  )
}

'use client'

import { TalentHero } from '@/components/sections/talent-hero'
import { TalentForBrands } from '@/components/sections/talent-for-brands'
import { TalentForCreators } from '@/components/sections/talent-for-creators'
import { Partnership } from '@/components/sections/partnership'

export default function TalentPage() {
  return (
    <div className="relative">
      <TalentHero />
      <TalentForBrands />
      <TalentForCreators />
      <Partnership />
    </div>
  )
}

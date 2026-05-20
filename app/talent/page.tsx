'use client'

import { TalentHero } from '@/components/sections/talent-hero'
import { TalentForBrands } from '@/components/sections/talent-for-brands'
import { TalentMethod } from '@/components/sections/talent-method'
import { TalentCapabilities } from '@/components/sections/talent-capabilities'
import { TalentForCreators } from '@/components/sections/talent-for-creators'
import { Partnership } from '@/components/sections/partnership'

export default function TalentPage() {
  return (
    <div className="relative">
      <TalentHero />
      <TalentForBrands />
      <TalentMethod />
      <TalentCapabilities />
      <TalentForCreators />
      <Partnership />
    </div>
  )
}

'use client'

import { TalentHero } from '@/components/sections/talent-hero'
import { TalentForBrands } from '@/components/sections/talent-for-brands'
import { TalentMethod } from '@/components/sections/talent-method'
import { TalentCapabilities } from '@/components/sections/talent-capabilities'
import { TalentForCreators } from '@/components/sections/talent-for-creators'
import { Partnership } from '@/components/sections/partnership'

import { TalentMarquee } from '@/components/sections/talent-aw/marquee'
import { TalentWordReveal } from '@/components/sections/talent-aw/word-reveal'
import { TalentCapabilitiesHover } from '@/components/sections/talent-aw/capabilities-hover'

export default function TalentPage() {
  return (
    <div className="relative">
      <TalentHero />
      <TalentMarquee />
      <TalentForBrands />
      <TalentWordReveal />
      <TalentMethod />
      <TalentCapabilitiesHover />
      <TalentCapabilities />
      <TalentForCreators />
      <Partnership />
    </div>
  )
}

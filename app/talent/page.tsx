'use client'

import { useTranslations } from 'next-intl'
import { DriftHero } from '@/components/sections/drift-hero'
import { TalentRoster } from '@/components/sections/talent-roster'
import { TalentMarquee } from '@/components/sections/talent-aw/marquee'
import { TalentForBrands } from '@/components/sections/talent-for-brands'
import { TalentMethod } from '@/components/sections/talent-method'
import { SelectedWork } from '@/components/sections/selected-work'
import { CreatorApply } from '@/components/sections/creator-apply'
import { Partnership } from '@/components/sections/partnership'
import { mailtoHref } from '@/lib/mailto'

export default function TalentPage() {
  const t = useTranslations()
  return (
    <div className="relative">
      <DriftHero
        lines={[
          t('talent.title_line1'),
          t('talent.title_line2'),
          t('talent.title_line3'),
        ]}
        lead={t('talent.description')}
        primaryCta={t('talent.cta_brand')}
        onPrimaryClick={() => {
          window.location.href = mailtoHref(t, 'talent_brand')
        }}
        outlineCta={t('talent.cta_creator')}
        onOutlineClick={() => {
          document
            .getElementById('creator-apply')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      <TalentRoster />
      <TalentMarquee />
      <TalentForBrands />
      <TalentMethod />
      <SelectedWork />
      <CreatorApply />
      <Partnership />
    </div>
  )
}

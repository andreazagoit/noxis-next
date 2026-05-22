'use client'

import { useTranslations } from 'next-intl'
import { DriftHero } from '@/components/sections/drift-hero'
import { DevelopmentStartupLane } from '@/components/sections/development-startup-lane'
import { FeaturedWork } from '@/components/sections/featured-work'
import { SelectedWork } from '@/components/sections/selected-work'
import { Partnership } from '@/components/sections/partnership'
import { MountainSeparator } from '@/components/ui/mountain-separator'
import { mailtoHref } from '@/lib/mailto'

export default function DevelopmentPage() {
  const t = useTranslations()
  return (
    <div className="relative">
      <DriftHero
        lines={[
          t('development.title_line1'),
          t('development.title_line2'),
          t('development.title_line3'),
        ]}
        lead={t('development.description')}
        primaryCta={t('development.cta_project')}
        onPrimaryClick={() => {
          window.location.href = mailtoHref(t, 'development')
        }}
        outlineCta={t('development.cta_work')}
        onOutlineClick={() => {
          document
            .getElementById('selected-work')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      <DevelopmentStartupLane />

      <MountainSeparator topColor="bg-background" bottomColor="bg-primary" />
      <FeaturedWork />

      <SelectedWork topMountain={false} />
      <MountainSeparator topColor="bg-primary" bottomColor="bg-background" />
      <Partnership />
    </div>
  )
}

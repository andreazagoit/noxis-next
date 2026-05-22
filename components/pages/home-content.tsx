'use client'

import { useTranslations } from 'next-intl'
import { DriftHero } from '@/components/sections/drift-hero'
import { Vision } from '@/components/sections/vision'
import { Services } from '@/components/sections/services'
import { SelectedWork } from '@/components/sections/selected-work'
import { Quotes } from '@/components/sections/quotes'
import { Partnership } from '@/components/sections/partnership'
import { mailtoHref } from '@/lib/mailto'

export function HomeContent() {
  const t = useTranslations()
  return (
    <div className="relative">
      <DriftHero
        lines={[
          t('hero.title_line1'),
          t('hero.title_line2'),
          t('hero.title_line3'),
        ]}
        lead={t('hero.description')}
        primaryCta={t('hero.cta')}
        onPrimaryClick={() => {
          window.location.href = mailtoHref(t, 'general')
        }}
      />
      <Vision />
      <Services />
      <SelectedWork />
      <Quotes
        items={t.raw('quotes.items') as string[]}
        backgroundColor="bg-background"
        textColor="text-foreground"
        className="mt-0"
      />
      <Partnership />
    </div>
  )
}

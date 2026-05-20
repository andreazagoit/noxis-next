'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { DotCTAButton } from '@/components/ui/dot-cta-button'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'

export function TalentForCreators() {
  const t = useTranslations()

  return (
    <section id="talent-creators" className="relative">
      <Container className="py-section">
        <Reveal width="100%" overflowVisible>
          <div className="rounded-3xl bg-muted p-8 md:p-12 lg:p-16 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex flex-col gap-4 flex-1">
              <Typography variant="caption" className="!text-primary">
                {t('talent.services.creator.eyebrow')}
              </Typography>
              <Typography variant="h2">
                {t('talent.services.creator.title')}
              </Typography>
              <Typography variant="body" className="text-muted-foreground md:max-w-[80%]">
                {t('talent.for_creators.description')}
              </Typography>
            </div>
            <div className="shrink-0">
              <DotCTAButton variant="primary" intent="talent_creator">
                {t('talent.cta_creator')}
              </DotCTAButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

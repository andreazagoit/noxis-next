'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { CleanButton } from '@/components/ui/clean-button'
import { Process } from '@/components/sections/process'
import { mailtoHref } from '@/lib/mailto'
import { cardPremium, glass as glassStyle } from '@/lib/styles'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const HIGHLIGHT_KEYS = ['idea', 'scale', 'ai', 'partner'] as const
const SMB_ITEM_KEYS = ['mvp', 'design', 'launch', 'iterate', 'ai'] as const
const ENTERPRISE_ITEM_KEYS = ['platforms', 'integrations', 'performance', 'support'] as const

export function DevelopmentContent() {
  const t = useTranslations()
  return (
    <div className="relative">
      <section className="pt-40 md:pt-52 pb-20 md:pb-28">
        <Container>
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <span aria-hidden className="h-px w-8 bg-primary/50" />
                {t('development.eyebrow')}
              </span>
              <h1 className="text-[2.7rem] leading-[1.06] md:text-[4.25rem] md:leading-[1.03] font-semibold tracking-[-0.03em] text-foreground">
                {t('development.title_line1')} {t('development.title_line2')}{' '}
                <em className="font-display italic font-normal text-primary tracking-[-0.01em]">
                  {t('development.title_line3')}
                </em>
              </h1>
              <p className="mt-7 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground">
                {t('development.description')}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <CleanButton href={mailtoHref(t, 'development')} arrow>
                  {t('development.cta_project')}
                </CleanButton>
                <CleanButton variant="outline" href="/#pricing">
                  {t('development.cta_pricing')}
                </CleanButton>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <Reveal width="100%" overflowVisible className="mb-16 md:mb-24">
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-28px_oklch(0.145_0_0/0.35)]">
                <Image
                  src="/images/dev-server-room.jpg"
                  alt={t('development.image_alt')}
                  width={1400}
                  height={935}
                  sizes="(min-width: 1024px) 90vw, 100vw"
                  className="w-full h-auto max-h-[480px] object-cover object-center"
                  priority={false}
                />
              </div>
              <div className={cn(glassStyle, 'absolute -bottom-6 left-6 md:left-10 max-w-[85%] md:max-w-md rounded-2xl px-6 py-4')}>
                <span className="text-sm md:text-base font-medium tracking-tight text-foreground">
                  {t('development.image_caption')}
                </span>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {HIGHLIGHT_KEYS.map((key, i) => (
              <Reveal key={key} width="100%" height="100%" delay={0.05 + i * 0.06}>
                <div className={cn(cardPremium, 'h-full rounded-3xl p-7')}>
                  <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">
                    {t(`development.highlights.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`development.highlights.${key}.description`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <SectionHeader
            title={`${t('development.services.title_line1')} ${t('development.services.title_line2')}`}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
            <Reveal width="100%" height="100%" delay={0.05}>
              <div className={cn(cardPremium, 'h-full rounded-3xl p-8 md:p-10')}>
                <span className="block mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {t('development.services.startup.eyebrow')}
                </span>
                <h3 className="mb-6 text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                  {t('development.services.startup.title')}
                </h3>
                <ul className="flex flex-col gap-5">
                  {SMB_ITEM_KEYS.map((key) => (
                    <li key={key}>
                      <h4 className="text-sm font-semibold tracking-tight text-foreground mb-1">
                        {t(`development.services.startup.items.${key}.title`)}
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {t(`development.services.startup.items.${key}.description`)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal width="100%" height="100%" delay={0.12}>
              <div className={cn(cardPremium, 'h-full rounded-3xl p-8 md:p-10')}>
                <span className="block mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {t('development.services.enterprise.eyebrow')}
                </span>
                <h3 className="mb-6 text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                  {t('development.services.enterprise.title')}
                </h3>
                <ul className="flex flex-col gap-5">
                  {ENTERPRISE_ITEM_KEYS.map((key) => (
                    <li key={key}>
                      <h4 className="text-sm font-semibold tracking-tight text-foreground mb-1">
                        {t(`development.services.enterprise.items.${key}.title`)}
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {t(`development.services.enterprise.items.${key}.description`)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Process />
    </div>
  )
}

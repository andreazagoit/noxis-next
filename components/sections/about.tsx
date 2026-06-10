'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { cardPremium, glass } from '@/lib/styles'
import { cn } from '@/lib/utils'

export function About() {
  const t = useTranslations()
  const photoRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <section id="approccio" className="py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 md:mb-24">
          <Reveal width="100%">
            <blockquote>
              <p className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.15] text-foreground">
                {t('vision.quote_line1')}{' '}
                <em className="font-display italic font-normal text-primary tracking-[-0.01em]">
                  {t('vision.quote_line2')}
                </em>
              </p>
              <p className="mt-7 text-base md:text-lg leading-relaxed text-muted-foreground">
                {t('vision.quote_description')}
              </p>
            </blockquote>
          </Reveal>

          <Reveal width="100%" delay={0.15} overflowVisible>
            <div ref={photoRef} className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-28px_oklch(0.145_0_0/0.35)]">
                {/* Slight scroll parallax: image moves slower than the page */}
                <motion.div style={{ y: parallaxY }} className="scale-[1.16]">
                  <Image
                    src="/images/about-dark.jpg"
                    alt={t('vision.image_alt')}
                    width={1400}
                    height={991}
                    sizes="(min-width: 1024px) 44vw, 92vw"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              </div>
              <div
                className={cn(glass, 'absolute -bottom-6 -left-4 md:-left-8 max-w-[85%] flex items-center gap-3 rounded-2xl px-5 py-4')}
              >
                <ShieldCheck size={20} aria-hidden className="shrink-0 text-primary" strokeWidth={1.75} />
                <span className="text-sm font-medium tracking-tight text-foreground">
                  {t('vision.image_badge')}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {(['vision', 'mission'] as const).map((key, i) => (
            <Reveal key={key} width="100%" height="100%" delay={0.1 + i * 0.08}>
              <div className={cn(cardPremium, 'h-full rounded-3xl p-9 md:p-11')}>
                <span className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <span aria-hidden className="h-px w-8 bg-primary/50" />
                  {t(`vision.our_${key}`)}
                </span>
                <h3 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
                  {t(`vision.${key}_title`).replace(/\n/g, ' ')}
                </h3>
                <p className="text-sm md:text-[0.95rem] leading-[1.75] text-muted-foreground">
                  {t(`vision.${key}_description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

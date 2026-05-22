'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { WordReveal } from '@/components/ui/word-reveal'
import { cn } from '@/lib/utils'

const SLOTS = [
  { className: 'md:col-span-4 md:row-span-2', big: true },
  { className: 'md:col-span-2 md:row-span-2', big: true },
  { className: 'md:col-span-2', big: false },
  { className: 'md:col-span-2', big: false },
  { className: 'md:col-span-2', big: false },
]

interface SelectedWorkProps {
  // legacy props kept for back-compat with existing callers; ignored.
  topMountain?: boolean
  bottomMountain?: boolean
  eyebrow?: string
  titleLine1?: string
  titleLine2?: string
}

export function SelectedWork({
  eyebrow = 'Selected Work',
  titleLine1 = 'From first commit',
  titleLine2 = 'to global scale.',
}: SelectedWorkProps) {
  const t = useTranslations()
  return (
    <section id="selected-work" className="relative bg-primary text-primary-foreground py-24 md:py-32 lg:py-40 overflow-hidden">
      <Container>
        <div className="mb-12 md:mb-16 flex flex-col gap-4">
          <Reveal width="100%">
            <Typography variant="caption" className="!text-primary-foreground/70">
              {eyebrow}
            </Typography>
          </Reveal>
          <Typography variant="display" className="!text-primary-foreground">
            <WordReveal text={titleLine1} delay={0.1} />
            <br />
            <WordReveal text={titleLine2} delay={0.25} />
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 md:auto-rows-[200px]">
          {SLOTS.map((s, i) => (
            <Reveal
              key={i}
              width="100%"
              height="100%"
              delay={i * 0.06}
              className={cn(
                'rounded-3xl overflow-hidden relative border border-white/15 bg-white/5 backdrop-blur-sm',
                s.className,
              )}
              style={{ display: 'block', minHeight: 240 }}
            >
              <div className="relative h-full w-full flex items-center justify-center p-6">
                <span
                  className={cn(
                    'font-heading font-bold uppercase tracking-tight text-primary-foreground/40 text-center',
                    s.big ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl',
                  )}
                >
                  {t('selected_work.placeholder')}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

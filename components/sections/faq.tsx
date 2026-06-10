'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/ui/section-header'
import { CleanButton } from '@/components/ui/clean-button'
import { FlipWords } from '@/components/ui/flip-words'
import { useCheckDialog } from '@/components/check/check-dialog'
import { cardStatic, darkPanel } from '@/lib/styles'
import { mailtoHref } from '@/lib/mailto'
import { cn } from '@/lib/utils'

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        cardStatic,
        'rounded-2xl transition-[border-color,box-shadow] duration-300',
        open && 'border-primary/30 shadow-[0_0_0_1px_oklch(0.705_0.213_47.6/0.25),0_16px_40px_-20px_oklch(0_0_0/0.8)]',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full cursor-pointer px-6 py-5 flex items-center justify-between gap-6 text-left"
      >
        <span
          className={cn(
            'text-base font-medium tracking-tight transition-colors',
            open ? 'text-primary' : 'text-foreground',
          )}
        >
          {question}
        </span>
        <span
          aria-hidden
          className={cn(
            'shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border text-primary text-xl leading-none',
            'transition-all duration-300',
            open ? 'rotate-45 border-primary/40 bg-primary/10' : 'border-foreground/10',
          )}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm md:text-[0.95rem] leading-[1.75] text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Faq() {
  const t = useTranslations()
  const { openCheck } = useCheckDialog()
  const faq = t.raw('pricing.faq') as { q: string; a: string }[]
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <section id="faq" className="py-24 md:py-32 scroll-mt-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.4fr] gap-12 lg:gap-20 items-start">
          {/* Colonna sinistra: intestazione sticky + contatto */}
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              eyebrow={t('pricing.faq_eyebrow')}
              title={t('pricing.faq_title')}
              accent={t('pricing.faq_title_accent')}
              description={t('pricing.faq_description')}
              className="mb-8"
            />
            <p className="text-sm text-muted-foreground mb-2">{t('pricing.faq_contact')}</p>
            <Link
              href={mailtoHref(t, 'general')}
              className="text-sm font-medium text-foreground underline underline-offset-8 decoration-foreground/30 hover:decoration-primary transition-colors"
            >
              {t('pricing.faq_contact_cta')}
            </Link>
          </div>

          {/* Colonna destra: domande come card */}
          <div className="flex flex-col gap-3">
            {faq.map((item, i) => (
              <FaqItem
                key={i}
                question={item.q}
                answer={item.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>

        <div className={cn(darkPanel, 'mt-20 md:mt-28 rounded-[2rem] text-foreground p-10 md:p-20 text-center shadow-[0_32px_80px_-32px_oklch(0_0_0/0.4)]')}>
          {/* Drifting spotlight */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-32 left-0 h-64 w-[480px] rounded-full bg-primary/20 blur-[90px] animate-[spotlight-drift_16s_ease-in-out_infinite] motion-reduce:animate-none"
          />
          <p className="relative mb-6 text-lg md:text-xl text-foreground/80">
            {t('pricing.final_cta_kicker_prefix')}{' '}
            <FlipWords
              words={t.raw('pricing.final_cta_kicker_words') as string[]}
              className="font-display italic text-primary mx-1"
            />{' '}
            {t('pricing.final_cta_kicker_suffix')}
          </p>
          <h3 className="relative mb-4 text-3xl md:text-[2.5rem] md:leading-[1.1] font-semibold tracking-[-0.025em]">
            {t('pricing.final_cta_title')}
          </h3>
          <p className="text-sm md:text-base leading-relaxed text-foreground/70 max-w-xl mx-auto mb-10">
            {t('pricing.final_cta_text')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <CleanButton
              onClick={openCheck}
              arrow
              className="bg-primary text-primary-foreground shadow-[0_16px_40px_-12px_oklch(0.705_0.213_47.6/0.7)] hover:bg-foreground hover:text-background"
            >
              {t('pricing.final_cta_button')}
            </CleanButton>
            <Link
              href={mailtoHref(t, 'general')}
              className="text-sm font-medium underline underline-offset-8 decoration-foreground/40 hover:decoration-primary transition-colors"
            >
              {t('pricing.final_cta_secondary')}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

'use client'

import { Fragment } from 'react'
import {
  Mail,
  Sparkles,
  FileText,
  Check,
  Database,
  Receipt,
  ShieldCheck,
  Inbox,
  Send,
  ArrowRight,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { cardStatic } from '@/lib/styles'
import { cn } from '@/lib/utils'

type Step = { title: string; detail: string }

/* Esempi: problema + tempo risparmiato (prima→dopo) + "come funziona"
   come card-tappa collegate da frecce dentro la card principale.
   `flow` = icone per tappa, allineate a use_cases.items.<key>.steps. */
const ITEMS = [
  { key: 'quotes', Icon: FileText, flow: [Mail, Sparkles, FileText, Check] },
  { key: 'documents', Icon: Receipt, flow: [Receipt, Sparkles, ShieldCheck, Database] },
  { key: 'email', Icon: Mail, flow: [Inbox, Sparkles, FileText, Send] },
] as const

export function UseCases() {
  const t = useTranslations()
  return (
    <section id="casi" className="py-24 md:py-32 scroll-mt-24">
      <Container>
        <SectionHeader
          eyebrow={t('use_cases.eyebrow')}
          title={t('use_cases.title_line1')}
          accent={t('use_cases.title_line2')}
          description={t('use_cases.description')}
        />

        <div className="flex flex-col gap-5 md:gap-6">
          {ITEMS.map(({ key, Icon, flow }, i) => {
            const steps = t.raw(`use_cases.items.${key}.steps`) as Step[]
            return (
              <Reveal key={key} width="100%" delay={0.06 + i * 0.06}>
                <article className={cn(cardStatic, 'rounded-3xl p-7 md:p-9')}>
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
                    <div className="flex-1">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/15">
                        <Icon size={20} strokeWidth={1.75} aria-hidden />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
                        {t(`use_cases.items.${key}.title`)}
                      </h3>
                      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {t(`use_cases.items.${key}.problem`)}
                      </p>
                    </div>

                    {/* Tempo risparmiato + prima→dopo */}
                    <div className="shrink-0 self-start rounded-2xl bg-primary/[0.06] px-5 py-4 ring-1 ring-primary/15 md:max-w-[14rem] md:text-right">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {t('use_cases.saved_label')}
                      </span>
                      <span className="mt-1 block font-display text-2xl leading-none text-primary md:text-[1.7rem]">
                        {t(`use_cases.items.${key}.saved`)}
                      </span>
                      <span className="mt-2 block text-xs leading-snug text-foreground/70">
                        {t(`use_cases.items.${key}.result`)}
                      </span>
                    </div>
                  </div>

                  {/* Come funziona — card-tappa collegate da frecce */}
                  <div className="mt-7 border-t border-foreground/[0.07] pt-7">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {t('use_cases.how_label')}
                    </span>
                    <div className="mt-5 flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
                      {steps.map((step, s) => {
                        const StepIcon = flow[s] ?? Sparkles
                        return (
                          <Fragment key={step.title}>
                            <div className="flex-1 rounded-2xl border border-foreground/[0.08] bg-background/50 p-4">
                              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/[0.1] text-primary ring-1 ring-primary/15">
                                <StepIcon size={15} strokeWidth={1.75} aria-hidden />
                              </div>
                              <h4 className="mb-1 text-sm font-semibold tracking-tight text-foreground">
                                {step.title}
                              </h4>
                              <p className="text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                            </div>
                            {s < steps.length - 1 && (
                              <div className="flex shrink-0 items-center justify-center py-1 lg:px-2 lg:py-0">
                                <ArrowRight
                                  size={18}
                                  aria-hidden
                                  className="rotate-90 text-foreground/30 lg:rotate-0"
                                />
                              </div>
                            )}
                          </Fragment>
                        )
                      })}
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

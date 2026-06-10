'use client'

import { useState, useTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateLeadStatus, deleteLead } from '@/lib/models/lead/operations'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/models/lead/config'
import { cn } from '@/lib/utils'

interface LeadRow {
  id: string
  name: string
  email: string
  company: string | null
  sector: string | null
  employees: string | null
  score: number | null
  answers: string | null
  locale: string | null
  source: string
  status: LeadStatus
  createdAt: string
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-primary/15 text-primary',
  contacted: 'bg-amber-400/15 text-amber-300',
  closed: 'bg-emerald-500/15 text-emerald-400',
}

const ANSWER_VALUE_KEYS = ['answer_no', 'answer_partial', 'answer_yes'] as const

function QuestionnairePanel({ answersJson }: { answersJson: string | null }) {
  const t = useTranslations()
  const questions = t.raw('check.questions') as string[]
  let answers: number[] = []
  try {
    answers = answersJson ? (JSON.parse(answersJson) as number[]) : []
  } catch {
    answers = []
  }
  if (answers.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('admin.no_questionnaire')}</p>
  }
  return (
    <ol className="flex flex-col gap-2.5">
      {answers.map((value, i) => (
        <li key={i} className="flex items-start justify-between gap-6 text-sm">
          <span className="text-foreground/80">
            <span className="text-muted-foreground mr-2">{i + 1}.</span>
            {questions[i] ?? '—'}
          </span>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              value === 2 && 'bg-emerald-500/15 text-emerald-400',
              value === 1 && 'bg-amber-400/15 text-amber-300',
              value === 0 && 'bg-white/[0.06] text-foreground/60',
            )}
          >
            {t(`check.${ANSWER_VALUE_KEYS[value] ?? 'answer_no'}`)}
          </span>
        </li>
      ))}
    </ol>
  )
}

function LeadCard({ lead }: { lead: LeadRow }) {
  const t = useTranslations()
  const [expanded, setExpanded] = useState(false)
  const [pending, startTransition] = useTransition()

  const date = new Date(lead.createdAt)
  const dateLabel = date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.07] bg-card',
        pending && 'opacity-60 pointer-events-none',
      )}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {lead.name}
            {lead.company && (
              <span className="font-normal text-muted-foreground"> · {lead.company}</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            <a href={`mailto:${lead.email}`} className="hover:underline">
              {lead.email}
            </a>
            {lead.sector && <> · {t(`check.form_sector_options.${lead.sector}`)}</>}
            {lead.employees && <> · {t(`check.form_employees_options.${lead.employees}`)}</>}
          </p>
        </div>

        {lead.score != null && (
          <span className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground/80">
            {Math.round((lead.score / 20) * 100)}%
          </span>
        )}

        <span className="shrink-0 text-xs text-muted-foreground">{dateLabel}</span>

        <select
          value={lead.status}
          onChange={(e) =>
            startTransition(() =>
              updateLeadStatus({ id: lead.id, status: e.target.value as LeadStatus }),
            )
          }
          className={cn(
            'shrink-0 cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40',
            STATUS_STYLES[lead.status],
          )}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-card text-foreground">
              {t(`admin.status.${s}`)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="shrink-0 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 text-foreground/70 hover:text-foreground transition-colors"
          aria-label={t('admin.toggle_questionnaire')}
        >
          <ChevronDown
            size={15}
            className={cn('transition-transform duration-300', expanded && 'rotate-180')}
          />
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm(t('admin.delete_confirm'))) {
              startTransition(() => deleteLead(lead.id))
            }
          }}
          className="shrink-0 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 text-foreground/50 hover:text-red-400 hover:border-red-400/40 transition-colors"
          aria-label={t('admin.delete')}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-5 py-4">
              <QuestionnairePanel answersJson={lead.answers} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const t = useTranslations()
  return (
    <div>
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t('admin.title')}
        </h1>
        <span className="text-sm text-muted-foreground">
          {t('admin.count', { count: leads.length })}
        </span>
      </div>

      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('admin.empty')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  )
}

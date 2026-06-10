'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { CleanButton } from '@/components/ui/clean-button'
import { cardStatic, darkPanel } from '@/lib/styles'
import { mailtoHref } from '@/lib/mailto'
import { cn } from '@/lib/utils'

const TOTAL_QUESTIONS = 10
const MAX_SCORE = TOTAL_QUESTIONS * 2

const SECTOR_KEYS = ['services', 'manufacturing', 'retail', 'other'] as const
const EMPLOYEE_KEYS = ['micro', 'small', 'medium', 'large'] as const

type Phase = 'quiz' | 'result' | 'done'

function bandIndex(score: number): number {
  if (score <= 7) return 0
  if (score <= 14) return 1
  return 2
}

/** La macchina a stati del check (quiz → risultato+form → fatto), senza chrome
    di pagina: vive dentro il CheckDialog. */
export function CheckFlow() {
  const t = useTranslations()
  const locale = useLocale()
  const questions = t.raw('check.questions') as string[]
  const bands = t.raw('check.bands') as { title: string; text: string }[]

  const [phase, setPhase] = useState<Phase>('quiz')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [sector, setSector] = useState<string>('')
  const [employees, setEmployees] = useState<string>('')
  const [website, setWebsite] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)

  const score = useMemo(() => answers.reduce((sum, a) => sum + a, 0), [answers])
  const band = bands[bandIndex(score)]
  const percent = Math.round((score / MAX_SCORE) * 100)

  const answerOptions = [
    { value: 2, label: t('check.answer_yes') },
    { value: 1, label: t('check.answer_partial') },
    { value: 0, label: t('check.answer_no') },
  ]

  const handleAnswer = (value: number) => {
    const next = [...answers, value]
    setAnswers(next)
    if (next.length >= TOTAL_QUESTIONS) {
      setPhase('result')
    } else {
      setStep(step + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(false)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company: company || undefined,
          sector: sector || undefined,
          employees: employees || undefined,
          score,
          answers,
          locale,
          website: website || undefined,
        }),
      })
      if (!res.ok) throw new Error('request_failed')
      setPhase('done')
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow'

  return (
    <AnimatePresence mode="wait">
      {phase === 'quiz' && (
        <motion.div
          key={`question-${step}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn(cardStatic, 'rounded-2xl p-6 md:p-8')}
        >
          <div className="flex items-center justify-between gap-6 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t('check.question_label', { current: step + 1, total: TOTAL_QUESTIONS })}
            </span>
            <div className="flex-1 max-w-[180px] h-1 rounded-full bg-foreground/10 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(step / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
          </div>
          <h2 className="mb-8 text-lg md:text-xl font-semibold tracking-tight text-foreground">
            {questions[step]}
          </h2>
          <div className="flex flex-wrap gap-3">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAnswer(option.value)}
                className="rounded-full border border-foreground/15 px-7 py-2.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          <div className={cn(darkPanel, 'rounded-2xl text-foreground p-6 md:p-8')}>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 block mb-4">
              {t('check.result_title')}
            </span>
            <div className="flex items-end gap-3 mb-2">
              <span className="font-display text-6xl md:text-7xl leading-none">{percent}%</span>
              <span className="text-xs uppercase tracking-wider text-foreground/60 pb-1.5">
                {t('check.result_score_label')}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/15 overflow-hidden mb-6">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
              {band.title}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/75">{band.text}</p>
          </div>

          <form onSubmit={handleSubmit} className={cn(cardStatic, 'rounded-2xl p-6 md:p-8')}>
            <h3 className="mb-1.5 text-lg font-semibold tracking-tight text-foreground">
              {t('check.form_title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{t('check.form_text')}</p>

            {/* Honeypot — hidden from real users */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute opacity-0 pointer-events-none h-0 w-0"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('check.form_name')}
                className={inputClass}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('check.form_email')}
                className={inputClass}
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={t('check.form_company')}
                className={inputClass}
              />
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className={cn(inputClass, !sector && 'text-muted-foreground')}
              >
                <option value="">{t('check.form_sector')}</option>
                {SECTOR_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t(`check.form_sector_options.${key}`)}
                  </option>
                ))}
              </select>
              <select
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                className={cn(inputClass, !employees && 'text-muted-foreground')}
              >
                <option value="">{t('check.form_employees')}</option>
                {EMPLOYEE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t(`check.form_employees_options.${key}`)}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-500 mb-4">{t('check.form_error')}</p>}

            <div className="flex flex-wrap items-center gap-4">
              <CleanButton
                type="submit"
                arrow
                className={cn('!px-6 !py-3 text-sm', sending && 'opacity-60 pointer-events-none')}
              >
                {sending ? t('check.form_sending') : t('check.form_submit')}
              </CleanButton>
              <p className="text-xs text-muted-foreground max-w-xs">{t('check.form_privacy')}</p>
            </div>
          </form>
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn(darkPanel, 'rounded-2xl text-foreground p-6 md:p-8')}
        >
          <h2 className="mb-3 text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            {t('check.success_title')}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/75 mb-6 max-w-xl">
            {t('check.success_text')}
          </p>
          <CleanButton
            href={mailtoHref(t, 'general')}
            className="bg-primary text-primary-foreground hover:bg-foreground hover:text-background !px-6 !py-3 text-sm"
          >
            {t('check.success_cta')}
          </CleanButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

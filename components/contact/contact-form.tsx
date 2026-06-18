'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { CleanButton } from '@/components/ui/clean-button'
import {
  CHECK_AREAS,
  PROJECT_TYPES,
  LEAD_EMPLOYEE_BANDS,
  type LeadOffer,
} from '@/lib/models/lead/config'
import { cn } from '@/lib/utils'

const inputClass =
  'w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow'

/** Form di contatto contestuale all'offerta: pochi dati, una domanda
    qualificante per capire l'esigenza (per il Progetto Completo: che
    progetto è), messaggio facoltativo. Niente mailto: lead nel DB + notifica. */
export function ContactForm({ offer }: { offer: LeadOffer }) {
  const t = useTranslations()
  const locale = useLocale()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [need, setNeed] = useState('')
  const [employees, setEmployees] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      setPhoneError(true)
      return
    }
    setPhoneError(false)
    setSending(true)
    setError(false)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company: company || undefined,
          source: 'contact',
          offer,
          need: need || undefined,
          employees: offer === 'audit' && employees ? employees : undefined,
          message: message || undefined,
          locale,
          website: website || undefined,
        }),
      })
      if (!res.ok) throw new Error('request_failed')
      setDone(true)
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="py-4">
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
          {t('contact.success_title')}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{t('contact.success_text')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Honeypot — invisibile agli utenti reali */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('contact.form_name')}
          autoComplete="name"
          className={inputClass}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('contact.form_email')}
          autoComplete="email"
          className={inputClass}
        />
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setPhoneError(false)
          }}
          placeholder={t('contact.form_phone')}
          autoComplete="tel"
          aria-invalid={phoneError}
          className={cn(inputClass, phoneError && 'border-red-500/60 focus:ring-red-500/40')}
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder={t('contact.form_company')}
          autoComplete="organization"
          className={inputClass}
        />
      </div>

      {/* Domanda qualificante per offerta */}
      {offer === 'sprint' && (
        <select
          required
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          className={cn(inputClass, !need && 'text-muted-foreground')}
        >
          <option value="">{t('contact.need_label_sprint')}</option>
          {PROJECT_TYPES.map((key) => (
            <option key={key} value={key}>
              {t(`contact.project_options.${key}`)}
            </option>
          ))}
        </select>
      )}
      {offer === 'automation' && (
        <select
          required
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          className={cn(inputClass, !need && 'text-muted-foreground')}
        >
          <option value="">{t('contact.need_label_automation')}</option>
          {CHECK_AREAS.map((key) => (
            <option key={key} value={key}>
              {t(`check.areas.${key}.title`)}
            </option>
          ))}
          <option value="other">{t('contact.need_other')}</option>
        </select>
      )}
      {offer === 'audit' && (
        <select
          required
          value={employees}
          onChange={(e) => setEmployees(e.target.value)}
          className={cn(inputClass, !employees && 'text-muted-foreground')}
        >
          <option value="">{t('contact.employees_label')}</option>
          {LEAD_EMPLOYEE_BANDS.map((key) => (
            <option key={key} value={key}>
              {t(`check.form_employees_options.${key}`)}
            </option>
          ))}
        </select>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder={t(offer === 'sprint' ? 'contact.message_placeholder_sprint' : 'contact.message_placeholder')}
        className={cn(inputClass, 'resize-none')}
      />

      {phoneError && <p className="text-sm text-red-500">{t('contact.form_phone_error')}</p>}
      {error && <p className="text-sm text-red-500">{t('contact.error')}</p>}

      <div className="mt-1 flex flex-wrap items-center gap-4">
        <CleanButton
          type="submit"
          arrow
          className={cn('!px-6 !py-3 text-sm', sending && 'opacity-60 pointer-events-none')}
        >
          {sending ? t('contact.sending') : t('contact.submit')}
        </CleanButton>
        <p className="text-xs text-muted-foreground max-w-xs">
          {t('contact.privacy')}{' '}
          <Link
            href="/privacy"
            target="_blank"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            {t('contact.privacy_link')}
          </Link>
        </p>
      </div>
    </form>
  )
}

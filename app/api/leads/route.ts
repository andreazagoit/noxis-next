import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { lead } from '@/lib/models'
import { LeadCreateSchema } from '@/lib/models/lead/validator'
import { sendEmail, isEmailEnabled } from '@/lib/email'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = LeadCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  const data = parsed.data

  // Honeypot: pretend success so bots don't adapt.
  if (data.website) {
    return NextResponse.json({ ok: true })
  }

  let stored = false
  try {
    await db.insert(lead).values({
      id: randomUUID(),
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      sector: data.sector ?? null,
      employees: data.employees ?? null,
      score: data.score ?? null,
      answers: data.answers ? JSON.stringify(data.answers) : null,
      locale: data.locale ?? null,
      source: 'ai-check',
    })
    stored = true
  } catch (err) {
    console.error('[leads] DB insert failed', err)
  }

  let notified = false
  if (isEmailEnabled) {
    try {
      await sendEmail({
        to: 'hello@noxis.agency',
        subject: `Nuovo lead AI Check: ${data.name}${data.company ? ` (${data.company})` : ''}`,
        html: leadEmailHtml(data),
      })
      notified = true
    } catch (err) {
      console.error('[leads] notification email failed', err)
    }
  }

  if (!stored && !notified) {
    return NextResponse.json({ error: 'persist_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

function leadEmailHtml(data: {
  name: string
  email: string
  company?: string
  sector?: string
  employees?: string
  score?: number
  answers?: number[]
  locale?: string
}) {
  const rows = [
    ['Nome', data.name],
    ['Email', data.email],
    ['Azienda', data.company ?? '—'],
    ['Settore', data.sector ?? '—'],
    ['Dimensione', data.employees ?? '—'],
    ['Punteggio', data.score != null ? `${data.score}/20` : '—'],
    ['Risposte', data.answers ? data.answers.join(', ') : '—'],
    ['Lingua', data.locale ?? '—'],
  ]
  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
  <h1 style="font-size: 18px; margin: 0 0 24px;">Nuovo lead dall'AI Readiness Check</h1>
  <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding: 6px 12px 6px 0; opacity: 0.6; vertical-align: top;">${label}</td><td style="padding: 6px 0;">${value}</td></tr>`,
      )
      .join('')}
  </table>
</body>
</html>`.trim()
}

import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resendFrom = process.env.RESEND_FROM

const resend = resendApiKey ? new Resend(resendApiKey) : null

/** True when Resend is fully configured and sendEmail will actually deliver. */
export const isEmailEnabled = !!(resendApiKey && resendFrom)

interface SendEmailParams {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  if (!resend || !resendFrom) {
    console.warn(`[email] Resend non configurato: invio saltato (to=${to}).`)
    return
  }

  const { error } = await resend.emails.send({
    from: resendFrom,
    to,
    subject,
    html,
    replyTo,
  })

  if (error) {
    console.error('[email] Resend error', error)
    throw new Error(`Failed to send email: ${error.message ?? 'unknown'}`)
  }
}

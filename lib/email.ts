import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resendFrom = process.env.RESEND_FROM

if (!resendApiKey) {
  // Logged only at runtime when send is actually attempted
  console.warn('[email] RESEND_API_KEY is not set — emails will not be sent.')
}

const resend = resendApiKey ? new Resend(resendApiKey) : null

/** True when Resend is fully configured and sendEmail will actually deliver. */
export const isEmailEnabled = !!(resendApiKey && resendFrom)

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend || !resendFrom) {
    console.warn(
      `[email] Skipping send to=${to} subject="${subject}" (Resend not configured).`,
    )
    console.warn(`[email] Body:\n${html}`)
    return
  }

  const { error } = await resend.emails.send({
    from: resendFrom,
    to,
    subject,
    html,
  })

  if (error) {
    console.error('[email] Resend error', error)
    throw new Error(`Failed to send email: ${error.message ?? 'unknown'}`)
  }
}

export function otpEmailHtml({ otp }: { otp: string }) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #ededed;">
  <h1 style="font-size: 18px; margin: 0 0 24px;">Sign in to Noxis</h1>
  <p style="font-size: 14px; opacity: 0.7; margin: 0 0 24px;">Use this code to complete your sign in. It expires in 10 minutes.</p>
  <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 24px; background: #161616; border-radius: 12px; text-align: center;">${otp}</div>
  <p style="font-size: 12px; opacity: 0.5; margin: 24px 0 0;">If you did not request this code, you can safely ignore this email.</p>
</body>
</html>`.trim()
}

export function welcomeEmailHtml({ signInUrl }: { signInUrl: string }) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #ededed;">
  <h1 style="font-size: 18px; margin: 0 0 16px;">Welcome to Noxis</h1>
  <p style="font-size: 14px; opacity: 0.7; margin: 0 0 24px;">Your account has been created. Sign in with your email and we'll send you a one-time code.</p>
  <a href="${signInUrl}" style="display: inline-block; padding: 12px 24px; background: #ededed; color: #0a0a0a; border-radius: 8px; font-weight: 600; text-decoration: none;">Sign in</a>
</body>
</html>`.trim()
}

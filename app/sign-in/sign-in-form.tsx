'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { authClient } from '@/lib/auth-client'
import { Container } from '@/components/layout/container'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

type Step = 'email' | 'code'

export function SignInForm() {
  const router = useRouter()
  const t = useTranslations()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDev = process.env.NODE_ENV === 'development'

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: err } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'sign-in',
    })

    if (err) {
      setLoading(false)
      setError(err.message ?? t('sign_in.error_send'))
      return
    }

    if (isDev) {
      const { error: signErr } = await authClient.signIn.emailOtp({
        email,
        otp: '000000',
      })
      setLoading(false)
      if (signErr) {
        setError(signErr.message ?? t('sign_in.error_generic'))
        return
      }
      router.push('/dashboard')
      router.refresh()
      return
    }

    setLoading(false)
    setStep('code')
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: err } = await authClient.signIn.emailOtp({
      email,
      otp,
    })

    setLoading(false)

    if (err) {
      setError(err.message ?? t('sign_in.error_generic'))
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    setError(null)
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="flex flex-col gap-4">
            <Typography variant="caption" className="text-primary">
              {t('sign_in.eyebrow')}
            </Typography>
            <Typography variant="display">
              {t('sign_in.title')}
            </Typography>
            <Typography variant="lead" className="text-muted-foreground">
              {step === 'email' ? t('sign_in.subtitle') : t('sign_in.code_subtitle', { email })}
            </Typography>
          </div>

          {step === 'email' ? (
            <form
              onSubmit={handleSendCode}
              className="flex flex-col gap-4 glass-panel rounded-3xl p-8"
            >
              <label className="flex flex-col gap-2">
                <Typography variant="caption" className="text-muted-foreground">
                  {t('sign_in.email')}
                </Typography>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              </label>

              {error && (
                <Typography variant="caption" className="text-red-500">
                  {error}
                </Typography>
              )}

              <Button type="submit" disabled={loading || !email} className="mt-2">
                {loading ? t('sign_in.sending') : t('sign_in.send_code')}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleVerify}
              className="flex flex-col gap-4 glass-panel rounded-3xl p-8"
            >
              <label className="flex flex-col gap-2">
                <Typography variant="caption" className="text-muted-foreground">
                  {t('sign_in.code')}
                </Typography>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoFocus
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-2xl tracking-[0.5em] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              </label>

              {error && (
                <Typography variant="caption" className="text-red-500">
                  {error}
                </Typography>
              )}

              <Button type="submit" disabled={loading || otp.length < 6} className="mt-2">
                {loading ? t('sign_in.verifying') : t('sign_in.submit')}
              </Button>

              <button
                type="button"
                onClick={handleBack}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
              >
                {t('sign_in.use_different_email')}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}

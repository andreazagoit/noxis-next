'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { signInAction, type SignInState } from './actions'

const INITIAL_STATE: SignInState = { error: false }

export function SignInForm() {
  const t = useTranslations()
  const [state, formAction, pending] = useActionState(signInAction, INITIAL_STATE)

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
              {t('sign_in.subtitle')}
            </Typography>
          </div>

          <form action={formAction} className="flex flex-col gap-4 glass-panel rounded-3xl p-8">
            <label className="flex flex-col gap-2">
              <Typography variant="caption" className="text-muted-foreground">
                {t('sign_in.email')}
              </Typography>
              <input
                type="email"
                name="email"
                required
                autoComplete="username"
                placeholder="you@company.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </label>

            <label className="flex flex-col gap-2">
              <Typography variant="caption" className="text-muted-foreground">
                {t('sign_in.password')}
              </Typography>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </label>

            {state.error && (
              <Typography variant="caption" className="text-red-500">
                {t('sign_in.error_invalid')}
              </Typography>
            )}

            <Button type="submit" disabled={pending} className="mt-2">
              {pending ? t('sign_in.signing_in') : t('sign_in.submit')}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  )
}

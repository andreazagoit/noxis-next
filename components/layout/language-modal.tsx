'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const LANGUAGES = [
  { code: 'it', label: 'IT' },
  { code: 'en', label: 'EN' },
] as const

const COOKIE = 'NEXT_LOCALE'

export function LanguageModal() {
  const router = useRouter()
  const current = useLocale()
  const [pending, startTransition] = useTransition()

  const change = (code: string) => {
    if (code === current) return
    document.cookie = `${COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div
      role="tablist"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-border p-1"
    >
      {LANGUAGES.map((lang) => {
        const active = current === lang.code
        return (
          <button
            key={lang.code}
            role="tab"
            aria-selected={active}
            onClick={() => change(lang.code)}
            disabled={pending}
            className={
              'px-3 py-1 text-xs font-medium rounded-full transition-colors ' +
              (active
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground')
            }
          >
            {lang.label}
          </button>
        )
      })}
    </div>
  )
}

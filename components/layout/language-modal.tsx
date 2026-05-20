'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const COOKIE = 'NEXT_LOCALE'

export function LanguageModal() {
  const router = useRouter()
  const current = useLocale()
  const [pending, startTransition] = useTransition()

  const other = current === 'it' ? 'en' : 'it'

  const change = () => {
    document.cookie = `${COOKIE}=${other}; path=/; max-age=${60 * 60 * 24 * 365}`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={change}
      disabled={pending}
      aria-label={`Switch language to ${other.toUpperCase()}`}
      className="group relative inline-flex items-center justify-center h-11 w-11 rounded-full bg-neutral-200 text-foreground overflow-hidden cursor-pointer transition-colors duration-300 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-xs font-bold uppercase tracking-[0.15em] transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-x-full"
      >
        {current.toUpperCase()}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-xs font-bold uppercase tracking-[0.15em] translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-0"
      >
        {other.toUpperCase()}
      </span>
    </button>
  )
}

'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Check, ChevronDown, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const COOKIE = 'NEXT_LOCALE'
const LOCALES = ['it', 'en'] as const

/** Selettore lingua a finestrella: trigger compatto, dropdown con le lingue. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const router = useRouter()
  const t = useTranslations()
  const current = useLocale()
  const [pending, startTransition] = useTransition()

  const change = (locale: (typeof LOCALES)[number]) => {
    if (locale === current) return
    document.cookie = `${COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('language.title')}
          disabled={pending}
          className={cn(
            'group inline-flex items-center gap-1.5 rounded-full px-2.5 py-2',
            'text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/60',
            'transition-colors hover:text-foreground cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
        >
          <Globe size={14} aria-hidden strokeWidth={1.75} />
          {current}
          <ChevronDown
            size={12}
            aria-hidden
            className="transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => change(locale)}
            className="flex items-center justify-between gap-4"
          >
            <span>{t(`language.${locale}`)}</span>
            {locale === current && (
              <Check size={14} aria-hidden className="text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

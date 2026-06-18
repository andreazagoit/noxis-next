'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useCheckDialog } from '@/components/check/check-dialog'

const ITEMS = [
  { href: '/', labelKey: 'header.home' },
  { href: '/#servizi', labelKey: 'header.services' },
  { href: '/#pricing', labelKey: 'header.pricing' },
] as const

interface MenuButtonProps {
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const emptySubscribe = () => () => {}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/' || pathname === ''
  return pathname === href || pathname.startsWith(`${href}/`)
}

const containerVariants = {
  closed: { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
  open: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  closed: { opacity: 0, y: 80, rotate: 8 },
  open: { opacity: 1, y: 0, rotate: 0 },
}

const cardVariantsReverse = {
  closed: { opacity: 0, y: 80, rotate: -8 },
  open: { opacity: 1, y: 0, rotate: 0 },
}

export function MenuButton({ className, open: openProp, onOpenChange }: MenuButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = openProp ?? internalOpen
  const setOpen = useCallback(
    (value: boolean | ((v: boolean) => boolean)) => {
      const next = typeof value === 'function' ? value(open) : value
      if (onOpenChange) onOpenChange(next)
      else setInternalOpen(next)
    },
    [open, onOpenChange],
  )
  // true solo dopo l'idratazione (serve per il portal), senza setState in effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
  const pathname = usePathname()
  const t = useTranslations()
  const { openCheck } = useCheckDialog()

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, setOpen])

  const handleLetsTalk = () => {
    const subject = encodeURIComponent(t('email.general.subject'))
    const body = encodeURIComponent(t('email.general.body'))
    window.location.href = `mailto:hello@noxis.agency?subject=${subject}&body=${body}`
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative inline-flex items-center justify-center gap-3 rounded-full overflow-hidden cursor-pointer select-none',
          'h-11 w-11 md:w-auto md:pl-6 md:pr-5',
          'border border-white/10 bg-white/[0.08] text-foreground backdrop-blur-xl',
          'transition-colors duration-300 hover:bg-white/[0.16]',
          'text-xs md:text-sm font-bold uppercase tracking-[0.15em]',
          className,
        )}
      >
        <span className="relative grid items-center overflow-hidden hidden md:grid">
          <span
            aria-hidden={open}
            className={cn(
              'col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              open ? '-translate-y-full' : 'translate-y-0',
            )}
          >
            MENU
          </span>
          <span
            aria-hidden={!open}
            className={cn(
              'col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              open ? 'translate-y-0' : 'translate-y-full',
            )}
          >
            CLOSE
          </span>
        </span>
        <span
          aria-hidden
          className={cn(
            'inline-flex items-center gap-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            open ? 'rotate-90' : 'rotate-0',
          )}
        >
          <span className="w-1.5 h-1.5 md:w-1 md:h-1 rounded-full bg-current" />
          <span className="w-1.5 h-1.5 md:w-1 md:h-1 rounded-full bg-current" />
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[80] bg-primary md:bg-transparent"
              />
            )}
          </AnimatePresence>,
          document.body,
        )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-cards"
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-24 inset-x-4 z-[90] flex flex-col gap-3 md:absolute md:top-full md:inset-x-0 md:mt-3"
          >
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="rounded-3xl bg-background border border-foreground/10 shadow-2xl p-6 flex flex-col gap-1"
            >
              {ITEMS.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-lg font-semibold hover:bg-foreground/5 transition-colors"
                  >
                    <span>{t(item.labelKey).toUpperCase()}</span>
                    {active && (
                      <span aria-hidden className="w-2 h-2 rounded-full bg-foreground" />
                    )}
                  </Link>
                )
              })}
            </motion.div>
            <motion.div
              variants={cardVariantsReverse}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="rounded-3xl bg-background border border-foreground/10 shadow-2xl p-6 flex flex-col gap-1"
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openCheck()
                }}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-lg font-semibold hover:bg-foreground/5 transition-colors cursor-pointer text-left"
              >
                <span>{t('header.cta_check').toUpperCase()}</span>
                <ArrowUpRight size={20} aria-hidden className="shrink-0" />
              </button>
              <button
                type="button"
                onClick={handleLetsTalk}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-lg font-semibold hover:bg-foreground/5 transition-colors cursor-pointer text-left"
              >
                <span>{t('header.lets_talk').toUpperCase()}</span>
                <ArrowUpRight size={20} aria-hidden className="shrink-0" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

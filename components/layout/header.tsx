'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/container'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOutAction } from '@/app/sign-in/actions'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { MenuButton } from '@/components/layout/menu-button'
import { glass } from '@/lib/styles'
import type { AppSession } from '@/lib/auth-utils'

const KNOWN_SUBS = ['development']

/** Due varianti animate a confronto: 'pill' (pillola flottante, blur che
    appare allo scroll) o 'island' (barra larga che morfa in capsula). */
const HEADER_DESIGN: 'pill' | 'island' = 'pill'

const NAV_ITEMS = [
  { href: '/#servizi', labelKey: 'header.services' },
  { href: '/#pricing', labelKey: 'header.pricing' },
  { href: '/#formazione', labelKey: 'header.formazione' },
  { href: '/development', labelKey: 'header.development' },
] as const

function getInitials(value: string): string {
  return (
    value
      .split(/[\s.@]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'U'
  )
}

function getRootHomeHref(): string {
  if (typeof window === 'undefined') return '/'
  const { hostname, protocol, port } = window.location
  const parts = hostname.split('.')

  let isSub = false
  let rootHost = hostname

  if (hostname.endsWith('.localhost')) {
    if (KNOWN_SUBS.includes(parts[0])) {
      isSub = true
      rootHost = 'localhost'
    }
  } else if (parts.length >= 3 && KNOWN_SUBS.includes(parts[0])) {
    isSub = true
    rootHost = parts.slice(1).join('.')
  }

  if (!isSub) return '/'
  return `${protocol}//${rootHost}${port ? `:${port}` : ''}/`
}

export type HeaderVariant = 'default' | 'contained' | 'dashboard'

interface HeaderProps {
  variant?: HeaderVariant
  session: AppSession
}

export function Header({ variant = 'contained', session }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()
  const [homeHref, setHomeHref] = useState('/')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isAnimated = variant === 'default' || variant === 'contained'

  useEffect(() => {
    setHomeHref(getRootHomeHref())
  }, [])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!isAnimated) return
    if (homeHref !== '/' || pathname !== '/') return
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSignOut = async () => {
    // Il redirect lo fa la server action; il refresh allinea l'header.
    await signOutAction()
    router.refresh()
  }

  const isAuthed = !!session
  const userName = 'Admin'
  const userEmail = session?.email ?? ''
  const initials = getInitials(userEmail || userName)

  const logoSize = 120

  const Logo = (
    <Link
      href={variant === 'dashboard' ? '/dashboard' : homeHref}
      onClick={handleLogoClick}
      className="flex items-center gap-2"
    >
      <Image
        src="/logo.svg"
        alt="Noxis"
        width={logoSize}
        height={logoSize}
        priority
        className={cn(
          variant === 'dashboard' ? '!h-4 !w-auto object-contain invert' : 'h-4 w-auto object-contain invert transition-[filter] duration-300',
        )}
      />
    </Link>
  )

  const AuthAction = isAuthed ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 transition-transform hover:scale-105 active:scale-95"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-none">{userName}</span>
          <span className="text-xs text-muted-foreground leading-none">{userEmail}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} variant="destructive">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null

  if (variant === 'dashboard') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-neutral-900 text-neutral-100">
        <Container>
          <div className="flex items-center justify-between h-16">
            {Logo}
            <div className="flex items-center gap-4">{AuthAction}</div>
          </div>
        </Container>
      </header>
    )
  }

  const inner = (
    <>
      {Logo}

      <div className="flex items-center gap-3 md:gap-6">
        {/* Voci a destra, testo puro */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const active =
              !item.href.includes('#') &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium tracking-tight transition-colors',
                    active ? 'text-foreground' : 'text-foreground/55 hover:text-foreground',
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            )
          })}
        </ul>

        <span aria-hidden className="hidden md:block h-4 w-px bg-white/10" />

        <LanguageSwitcher className="hidden md:inline-flex" />

        <span className="md:hidden">
          <MenuButton open={menuOpen} onOpenChange={setMenuOpen} />
        </span>
        {AuthAction}
      </div>
    </>
  )

  // ── Variante B: "island" — barra larga che allo scroll morfa in capsula ──
  if (HEADER_DESIGN === 'island') {
    return (
      <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -20, opacity: 0, maxWidth: 1240 }}
          animate={{
            y: 0,
            opacity: 1,
            maxWidth: scrolled ? 760 : 1240,
            marginTop: scrolled ? 10 : 16,
            height: scrolled ? 52 : 60,
            paddingLeft: scrolled ? 20 : 0,
            paddingRight: scrolled ? 20 : 0,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="pointer-events-auto relative flex w-full items-center justify-between gap-4 rounded-full"
        >
          <motion.span
            aria-hidden
            initial={false}
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={cn(glass, 'absolute inset-0 -z-10 rounded-full')}
          />
          {inner}
        </motion.nav>
      </header>
    )
  }

  // ── Variante A: "pill" — a riposo il contenuto è allineato ai bordi del
  // container; allo scroll la pillola appare e si restringe verso il centro ──
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] pt-4 md:pt-5 pointer-events-none">
      <Container>
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            // Larghezza sempre = container: allo scroll cambiano solo i padding,
            // così il contenuto rientra dentro la pillola.
            paddingLeft: scrolled ? 24 : 0,
            paddingRight: scrolled ? 24 : 0,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="pointer-events-auto relative flex h-14 w-full items-center justify-between gap-4 rounded-full"
        >
          <motion.span
            aria-hidden
            initial={false}
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className={cn(glass, 'absolute inset-0 -z-10 rounded-full')}
          />
          {inner}
        </motion.nav>
      </Container>
    </header>
  )
}

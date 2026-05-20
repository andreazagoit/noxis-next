'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Typography } from '@/components/ui/typography'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth-client'
import { LanguageModal } from '@/components/layout/language-modal'
import type { AppSession } from '@/lib/auth-utils'

const SCROLL_THRESHOLD = 80

const NAV_ITEMS = [
  { href: '/development', key: 'development' },
  { href: '/talent', key: 'talent' },
] as const

const KNOWN_SUBS = ['development', 'talent']

const transition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }

const navVariants = {
  top: {
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: 0,
    backgroundColor: 'color-mix(in oklab, var(--background) 0%, transparent)',
    borderColor: 'color-mix(in oklab, var(--foreground) 0%, transparent)',
    boxShadow: '0 0 0 0 rgba(0,0,0,0)',
    backdropFilter: 'blur(0px)',
  },
  scrolled: {
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 999,
    backgroundColor: 'color-mix(in oklab, var(--background) 60%, transparent)',
    borderColor: 'color-mix(in oklab, var(--foreground) 10%, transparent)',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(12px)',
  },
}

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
  const lenis = useLenis()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()
  const [scrolled, setScrolled] = useState(false)
  const [homeHref, setHomeHref] = useState('/')
  const [activeSub, setActiveSub] = useState<string | null>(null)

  const isAnimated = variant === 'default' || variant === 'contained'

  useEffect(() => {
    if (!isAnimated) return
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isAnimated])

  useEffect(() => {
    setHomeHref(getRootHomeHref())
    const host = window.location.hostname
    const first = host.split('.')[0]
    if (KNOWN_SUBS.includes(first)) setActiveSub(first)
    else setActiveSub(null)
  }, [])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!isAnimated) return
    if (homeHref !== '/' || pathname !== '/') return
    e.preventDefault()
    lenis?.scrollTo(0)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const isAuthed = !!session
  const userName = session?.user.name ?? ''
  const userEmail = session?.user.email ?? ''
  const userImage = session?.user.image ?? null
  const initials = getInitials(userName || userEmail)

  const logoSize = 120

  const Logo = (
    <Link
      href={variant === 'dashboard' ? '/dashboard' : homeHref}
      onClick={handleLogoClick}
      className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
    >
      <Image
        src="/logo.svg"
        alt="Noxis"
        width={logoSize}
        height={logoSize}
        priority
        className={variant === 'dashboard' ? 'w-9 h-9 object-contain' : 'h-4 w-auto object-contain'}
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
            {userImage && <AvatarImage src={userImage} alt={userName} />}
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
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <Container variant="default">
          <div className="flex items-center justify-between h-16">
            {Logo}
            <div className="flex items-center gap-4">{AuthAction}</div>
          </div>
        </Container>
      </header>
    )
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] pt-6 pointer-events-none"
    >
      <Container
        variant={variant === 'contained' ? 'contained' : 'default'}
        className={variant === 'contained' ? 'px-6 md:px-12 lg:px-20' : undefined}
      >
        <nav className="pointer-events-auto flex items-center justify-between gap-3 md:gap-6 w-full">
          <motion.div
            variants={navVariants}
            animate={scrolled ? 'scrolled' : 'top'}
            transition={transition}
            className="border flex items-center h-[60px]"
          >
            {Logo}
          </motion.div>

          <motion.div
            variants={navVariants}
            animate={scrolled ? 'scrolled' : 'top'}
            transition={transition}
            className="border flex items-center gap-4 md:gap-6 h-[60px]"
          >
            <div className="flex items-center gap-3 md:gap-6">
              {NAV_ITEMS.map((item) => {
                const active =
                  activeSub === item.key ||
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={
                      'text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] transition-colors ' +
                      (active
                        ? 'text-foreground underline decoration-2 underline-offset-8'
                        : 'text-foreground/70 hover:text-foreground')
                    }
                  >
                    {t(`header.${item.key}`)}
                  </Link>
                )
              })}
            </div>

            <div className="hidden md:inline-flex">
              <LanguageModal />
            </div>
            {AuthAction}
          </motion.div>
        </nav>
      </Container>
    </motion.header>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/container'
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
import { MenuButton } from '@/components/layout/menu-button'
import { DotSlideButton } from '@/components/ui/dot-slide-button'
import type { AppSession } from '@/lib/auth-utils'

const KNOWN_SUBS = ['development', 'talent']

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
  const [homeHref, setHomeHref] = useState('/')
  const [menuOpen, setMenuOpen] = useState(false)

  const isAnimated = variant === 'default' || variant === 'contained'

  useEffect(() => {
    setHomeHref(getRootHomeHref())
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
      className="flex items-center gap-2"
    >
      <Image
        src="/logo.svg"
        alt="Noxis"
        width={logoSize}
        height={logoSize}
        priority
        className={cn(
          variant === 'dashboard' ? '!h-4 !w-auto object-contain invert' : 'h-4 w-auto object-contain transition-[filter] duration-300',
          variant !== 'dashboard' && menuOpen && 'invert md:invert-0',
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
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-neutral-900 text-neutral-100">
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
      <Container>
        <nav className="pointer-events-auto flex items-center justify-between gap-3 md:gap-6 w-full">
          <div className="flex items-center h-[60px]">
            {Logo}
          </div>

          <div className="flex items-center gap-4 md:gap-6 h-[60px]">
            <div className="relative z-[100] flex items-center gap-4 md:gap-6">
              <div className="hidden md:inline-flex">
                <LanguageModal />
              </div>
              <DotSlideButton variant="primary" intent="general" className="!py-0 h-11 !bg-[rgb(43,46,58)] hover:!bg-primary hidden md:inline-flex">
                {t('header.lets_talk')}
              </DotSlideButton>
              <MenuButton open={menuOpen} onOpenChange={setMenuOpen} />
            </div>
            {AuthAction}
          </div>
        </nav>
      </Container>
    </motion.header>
  )
}

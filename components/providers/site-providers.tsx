'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { LoadingProvider } from '@/context/loading-context'
import { SmoothScroll } from '@/components/layout/smooth-scroll'
import { CustomScrollbar } from '@/components/ui/custom-scrollbar'
import { Header, type HeaderVariant } from '@/components/layout/header'
import { Footer } from '@/components/sections/footer'
import type { AppSession } from '@/lib/auth-utils'

const DASHBOARD_PREFIXES = ['/dashboard']

function pickHeaderVariant(pathname: string): HeaderVariant {
  if (DASHBOARD_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return 'dashboard'
  }
  return 'contained'
}

export function SiteProviders({
  children,
  session,
}: {
  children: ReactNode
  session: AppSession
}) {
  const pathname = usePathname()
  const variant = pickHeaderVariant(pathname)
  const isDashboard = variant === 'dashboard'
  const showFooter = !isDashboard

  const chrome = (
    <>
      {!isDashboard && <CustomScrollbar />}
      <Header variant={variant} session={session} />
      <main className={isDashboard ? 'relative' : 'relative min-h-screen'}>
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  )

  return (
    <LoadingProvider>
      <ThemeProvider defaultTheme="light">
        {isDashboard ? chrome : <SmoothScroll>{chrome}</SmoothScroll>}
      </ThemeProvider>
    </LoadingProvider>
  )
}

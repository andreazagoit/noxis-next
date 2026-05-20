import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'
import { cn } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { SiteProviders } from '@/components/providers/site-providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const fontMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Noxis',
  description: 'Noxis — design, web, mobile, AI agency.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    title: 'Noxis',
    description: 'Noxis — design, web, mobile, AI agency.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noxis',
    description: 'Noxis — design, web, mobile, AI agency.',
    images: ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() })
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', inter.variable)}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteProviders session={session}>{children}</SiteProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

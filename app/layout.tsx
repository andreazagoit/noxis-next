import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter, Instrument_Serif } from 'next/font/google'
import { headers } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import './globals.css'
import { cn } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { SiteProviders } from '@/components/providers/site-providers'
import { OrganizationJsonLd } from '@/components/seo/organization-jsonld'
import { SITE_URL } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})
const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})
const fontDisplay = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('seo')
  const locale = await getLocale()
  const title = t('title')
  const description = t('description')
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: '%s' },
    description,
    keywords: t('keywords'),
    applicationName: 'Noxis',
    authors: [{ name: 'Noxis', url: SITE_URL }],
    creator: 'Noxis',
    publisher: 'Noxis',
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/icon.svg',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: { canonical: '/', languages: { en: '/', it: '/' } },
    openGraph: {
      type: 'website',
      siteName: 'Noxis',
      title,
      description,
      url: SITE_URL,
      locale,
      images: ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
  }
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
      className={cn('antialiased overscroll-none', fontMono.variable, fontDisplay.variable, 'font-sans', inter.variable)}
    >
      <body>
        <OrganizationJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteProviders session={session}>{children}</SiteProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

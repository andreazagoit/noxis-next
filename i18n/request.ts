import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export const SUPPORTED_LOCALES = ['en', 'it'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

function pickFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  for (const part of header.split(',')) {
    const tag = part.trim().split(';')[0].split('-')[0].toLowerCase()
    if ((SUPPORTED_LOCALES as readonly string[]).includes(tag)) return tag as Locale
  }
  return null
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  let locale: Locale = DEFAULT_LOCALE

  if (cookieLocale && (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)) {
    locale = cookieLocale as Locale
  } else {
    const headerList = await headers()
    const fromHeader = pickFromAcceptLanguage(headerList.get('accept-language'))
    if (fromHeader) locale = fromHeader
  }

  const messages = (await import(`../locales/${locale}.json`)).default

  return { locale, messages }
})

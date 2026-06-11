import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

type Page = 'home' | 'development' | 'privacy'

const PATH_BY_PAGE: Record<Page, string> = {
  home: '/',
  development: '/development',
  privacy: '/privacy',
}

export const SITE_URL = 'https://noxis.agency'

/**
 * Build per-page Next.js Metadata from locale-aware seo.* keys.
 * Reads: seo.<page>.title, seo.<page>.description, seo.<page>.keywords,
 *        seo.<page>.og_title, seo.<page>.og_description.
 * Falls back to seo.title / seo.description / seo.keywords when missing.
 */
export async function buildMetadata(page: Page): Promise<Metadata> {
  const t = await getTranslations('seo')
  const locale = await getLocale()
  const path = PATH_BY_PAGE[page]

  const title = safe(t, `${page}.title`) ?? safe(t, 'title') ?? 'Noxis'
  const description =
    safe(t, `${page}.description`) ?? safe(t, 'description') ?? ''
  const keywords =
    safe(t, `${page}.keywords`) ?? safe(t, 'keywords') ?? undefined
  const ogTitle = safe(t, `${page}.og_title`) ?? title
  const ogDescription = safe(t, `${page}.og_description`) ?? description

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
      languages: {
        en: path,
        it: path,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Noxis',
      title: ogTitle,
      description: ogDescription,
      url: `${SITE_URL}${path}`,
      locale,
      images: ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ['/og-image.jpg'],
    },
  }
}

function safe(t: (k: string) => string, key: string): string | undefined {
  try {
    const v = t(key)
    return v && v !== key ? v : undefined
  } catch {
    return undefined
  }
}

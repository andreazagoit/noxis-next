import { SITE_URL } from '@/lib/seo'

/**
 * Inlines a JSON-LD Organization schema in the document head.
 * Renders on the server; no client JS.
 */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Noxis',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: [] as string[],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'hello@noxis.agency',
        availableLanguage: ['English', 'Italian'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via G. Mazzini 5a',
      postalCode: '35010',
      addressLocality: 'Trebaseleghe',
      addressRegion: 'PD',
      addressCountry: 'IT',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

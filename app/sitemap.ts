import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    { path: '/',            priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/development', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/talent',      priority: 0.9, changeFrequency: 'monthly' as const },
  ]
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: {
      languages: {
        en: `${SITE_URL}${r.path}`,
        it: `${SITE_URL}${r.path}`,
      },
    },
  }))
}

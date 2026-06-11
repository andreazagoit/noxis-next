import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/layout/container'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('privacy')
}

export default async function PrivacyPage() {
  const t = await getTranslations()
  const sections = t.raw('privacy.sections') as { title: string; body: string }[]

  return (
    <main className="pt-36 pb-24 md:pb-32">
      <Container>
        <article className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {t('privacy.title')}
          </h1>
          <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
            {t('privacy.updated')}
          </p>
          <p className="mt-8 text-sm leading-[1.8] text-muted-foreground">{t('privacy.intro')}</p>
          {sections.map((section) => (
            <section key={section.title} className="mt-10">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-[1.8] text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </article>
      </Container>
    </main>
  )
}

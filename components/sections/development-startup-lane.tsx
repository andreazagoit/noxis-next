'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { BentoWireframe, type GeometryType } from '@/components/3d/bento-wireframe-lazy'
import { WordReveal } from '@/components/ui/word-reveal'
import { useIsMobile } from '@/hooks/use-mobile'

interface BentoItem {
  key: string
  title: string
  description: string
  span: string
  accent?: boolean
  geometry: GeometryType
}

export function DevelopmentStartupLane() {
  const t = useTranslations()
  const isMobile = useIsMobile()

  const bentoItems: BentoItem[] = [
    {
      key: 'mvp',
      title: t('development.services.startup.items.mvp.title'),
      description: t('development.services.startup.items.mvp.description'),
      span: 'md:col-span-2 md:row-span-2',
      accent: true,
      geometry: 'icosahedron',
    },
    {
      key: 'design',
      title: t('development.services.startup.items.design.title'),
      description: t('development.services.startup.items.design.description'),
      span: 'md:col-span-1 md:row-span-2',
      geometry: 'torusKnot',
    },
    {
      key: 'launch',
      title: t('development.services.startup.items.launch.title'),
      description: t('development.services.startup.items.launch.description'),
      span: 'md:col-span-1 md:row-span-1',
      geometry: 'torus',
    },
    {
      key: 'iterate',
      title: t('development.services.startup.items.iterate.title'),
      description: t('development.services.startup.items.iterate.description'),
      span: 'md:col-span-1 md:row-span-1',
      geometry: 'octahedron',
    },
    {
      key: 'ai',
      title: t('development.services.startup.items.ai.title'),
      description: t('development.services.startup.items.ai.description'),
      span: 'md:col-span-1 md:row-span-1',
      geometry: 'dodecahedron',
    },
  ]

  return (
    <section id="development-startup">
      <Container className="py-section">
        <div className="mb-element flex flex-col gap-3">
          <Reveal width="100%">
            <Typography variant="caption" className="!text-primary">
              {t('development.services.startup.eyebrow')}
            </Typography>
          </Reveal>
          <Typography variant="display">
            <WordReveal text={t('development.services.startup.title')} delay={0.1} />
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-element auto-rows-[240px]">
          {bentoItems.map((item, index) => {
            const isLarge = !isMobile && item.span.includes('col-span-2')
            const isTall = !isMobile && item.span.includes('row-span-2') && !isLarge
            const isSmall = !isMobile && !isLarge && !isTall

            return (
              <Reveal
                key={item.key}
                width="100%"
                height="100%"
                delay={index * 0.1}
                duration={0.6}
                className={`group relative overflow-hidden rounded-3xl ${item.span} ${
                  item.accent
                    ? 'bg-gradient-to-br from-primary/80 to-primary text-primary-foreground border border-transparent hover:border-primary-foreground/40'
                    : 'glass-panel hover:border-primary/50'
                } transition-all duration-500`}
                style={{ display: 'block', height: '100%' }}
              >
                <div className="relative h-full w-full">
                  <div
                    className={`relative z-10 p-6 md:p-8 flex flex-col pointer-events-none ${
                      isMobile ? 'h-full justify-between' : ''
                    } ${isLarge ? 'h-full justify-center w-full md:w-1/2' : ''} ${
                      isTall ? 'h-full justify-end' : ''
                    } ${isSmall ? 'h-full justify-center w-1/2' : ''}`}
                  >
                    <div className="pointer-events-auto">
                      <Typography
                        variant={isLarge ? 'h2' : isTall ? 'h3' : 'h4'}
                        className={`mb-3 ${
                          item.accent
                            ? '!text-primary-foreground'
                            : 'group-hover:text-primary transition-colors'
                        }`}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body"
                        className={`line-clamp-4 ${
                          item.accent ? '!text-primary-foreground/80' : 'text-muted-foreground'
                        }`}
                      >
                        {item.description}
                      </Typography>
                    </div>
                  </div>

                  <BentoWireframe
                    geometry={item.geometry}
                    accentColor={item.accent}
                    useGlass
                    position={
                      isMobile
                        ? [0, -1.5, 0]
                        : isLarge
                          ? [2, 0, 0]
                          : isTall
                            ? [0, 1.5, 0]
                            : [1.5, 0, 0]
                    }
                  />
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

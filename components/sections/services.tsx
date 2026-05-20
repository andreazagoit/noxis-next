'use client'

import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/reveal'
import { BentoWireframe, type GeometryType } from '@/components/3d/bento-wireframe'
import { Container } from '@/components/layout/container'
import { Typography } from '@/components/ui/typography'
import { useIsMobile } from '@/hooks/use-mobile'

interface BentoItem {
  title: string
  description: string
  span: string
  accent?: boolean
  geometry: GeometryType
}

export function Services() {
  const t = useTranslations()
  const isMobile = useIsMobile()

  const bentoItems: BentoItem[] = [
    {
      title: t('services.web_dev.title'),
      description: t('services.web_dev.description'),
      span: 'md:col-span-2 md:row-span-2',
      accent: true,
      geometry: 'icosahedron',
    },
    {
      title: t('services.ux_ui.title'),
      description: t('services.ux_ui.description'),
      span: 'md:col-span-1 md:row-span-2',
      geometry: 'torusKnot',
    },
    {
      title: t('services.mobile_dev.title'),
      description: t('services.mobile_dev.description'),
      span: 'md:col-span-1 md:row-span-1',
      geometry: 'torus',
    },
    {
      title: t('services.ai.title'),
      description: t('services.ai.description'),
      span: 'md:col-span-1 md:row-span-1',
      geometry: 'octahedron',
    },
    {
      title: t('services.marketing.title'),
      description: t('services.marketing.description'),
      span: 'md:col-span-1 md:row-span-1',
      geometry: 'dodecahedron',
    },
  ]

  return (
    <section id="services">
      <Container className="py-section">
        <Reveal width="100%" className="mb-element">
          <div className="mb-element">
            <Typography variant="display" className="mb-element">
              {t('services.title_line1')} <br />
              <span className="text-primary">{t('services.title_line2')}</span>
            </Typography>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-element auto-rows-[240px]">
          {bentoItems.map((item, index) => {
            const isLarge = !isMobile && item.span.includes('col-span-2')
            const isTall = !isMobile && item.span.includes('row-span-2') && !isLarge
            const isSmall = !isMobile && !isLarge && !isTall

            return (
              <Reveal
                key={index}
                width="100%"
                height="100%"
                delay={index * 0.1}
                duration={0.6}
                className={`group relative overflow-hidden rounded-3xl ${item.span} ${
                  item.accent
                    ? 'bg-gradient-to-br from-primary/80 to-primary text-black border border-transparent hover:border-white'
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
                          item.accent ? '!text-black' : 'group-hover:text-primary transition-colors'
                        }`}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body"
                        className={`line-clamp-4 ${
                          item.accent ? '!text-black/80' : 'text-muted-foreground'
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

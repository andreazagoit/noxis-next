'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { GlassScene } from '@/components/3d/glass-scene'
import { Container } from '@/components/layout/container'
import { useLoading } from '@/context/loading-context'
import { CTAButton } from '@/components/ui/cta-button'
import { BrandSlider } from '@/components/ui/brand-slider'
import { Typography } from '@/components/ui/typography'

const SKILLS = [
  { key: 'web', position: 'absolute -top-8 -right-8 md:-top-10 md:right-auto md:left-1/2 md:-translate-x-1/2' },
  { key: 'mobile', position: 'absolute -bottom-8 -left-8 md:-bottom-10 md:left-1/2 md:-translate-x-1/2' },
  { key: 'design', position: 'absolute -top-8 -left-8 md:top-1/2 md:-left-10 md:-translate-x-full md:-translate-y-1/2' },
  { key: 'strategy', position: 'absolute -bottom-8 -right-8 md:top-1/2 md:-right-10 md:translate-x-full md:-translate-y-1/2' },
] as const

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const [rotation, setRotation] = useState(0)
  const { isLoading } = useLoading()
  const t = useTranslations()

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 90)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={containerRef} className="relative w-full">
      <div
        className="sticky top-0 z-0 md:z-20 pointer-events-none"
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          initial={{ opacity: 0 }}
          animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          <GlassScene />
        </motion.div>
      </div>

      <div className="relative" style={{ marginTop: '-100vh' }}>
        <div
          className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2 z-[-1]"
          style={{
            background:
              'linear-gradient(to bottom, var(--border) 80%, transparent 100%)',
          }}
        />

        <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
          <Container className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-24 items-center">
            <div className="flex items-center md:pl-0 order-1 md:order-2">
              <div className="w-full">
                <Typography variant="display" className="text-left text-foreground">
                  {[1, 2, 3].map((line) => (
                    <div key={line} className="overflow-hidden">
                      <motion.div
                        className={line === 2 ? 'text-primary' : undefined}
                        initial={{ y: '100%' }}
                        animate={isLoading ? { y: '100%' } : { y: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.33, 1, 0.68, 1],
                          delay: 0.2 + line * 0.1,
                        }}
                      >
                        {t(`hero.title_line${line}`)}
                      </motion.div>
                    </div>
                  ))}
                </Typography>
              </div>
            </div>

            <div className="flex flex-col justify-center md:pr-0 order-2 md:order-1">
              <div className="flex flex-col items-start gap-4 md:gap-6 md:max-w-[70%]">
                <Typography variant="lead" className="text-left flex flex-wrap gap-x-[0.35em] gap-y-0">
                  {t('hero.description')
                    .split(' ')
                    .map((word, i) => (
                      <span key={i} className="inline-block overflow-hidden py-1 -my-1">
                        <motion.span
                          className="inline-block"
                          initial={{ y: '100%', opacity: 0 }}
                          animate={
                            isLoading ? { y: '100%', opacity: 0 } : { y: 0, opacity: 1 }
                          }
                          transition={{
                            duration: 0.5,
                            ease: [0.33, 1, 0.68, 1],
                            delay: 0.8 + i * 0.05,
                          }}
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                </Typography>
                <div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={isLoading ? { y: 20, opacity: 0 } : { y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 1.2 }}
                  >
                    <CTAButton variant="primary" intent="general" className="mt-8 md:mt-4">
                      {t('hero.cta')}
                    </CTAButton>
                  </motion.div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <BrandSlider />

        <div className="w-full h-auto flex items-center justify-center pt-32 md:pt-48">
          <Container className="py-section flex items-center justify-center">
            <Typography variant="h2" className="text-center">
              {t('hero.we_are_good_at')}
            </Typography>
          </Container>
        </div>

        <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-[-1]" />

          <Container className="relative h-full w-full flex items-center justify-center">
            <div className="relative w-[280px] h-[280px] md:w-[55vh] md:h-[55vh]">
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: rotation }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-primary/60" />

                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = i * 30
                  const radius = 50
                  const x = (Math.sin((angle * Math.PI) / 180) * radius).toFixed(5)
                  const y = (-Math.cos((angle * Math.PI) / 180) * radius).toFixed(5)
                  return (
                    <div
                      key={i}
                      className="absolute w-1 h-3 rounded-full bg-primary"
                      style={{
                        top: `calc(50% + ${y}%)`,
                        left: `calc(50% + ${x}%)`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      }}
                    />
                  )
                })}
              </motion.div>

              <div className="absolute inset-0 pointer-events-none">
                {SKILLS.map((skill, i) => (
                  <div key={skill.key} className={`${skill.position} flex items-center gap-2`}>
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        className="absolute w-4 h-4 rounded-full bg-primary"
                        animate={{ scale: [0.5, 1.2, 1.8], opacity: [0, 0.5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeOut',
                          delay: i * 0.5,
                        }}
                      />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary relative z-10" />
                    </div>
                    <Typography variant="caption">
                      {t(`hero.skills.${skill.key}`)}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}

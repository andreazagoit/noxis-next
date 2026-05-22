'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { Typography } from '@/components/ui/typography'
import { WordReveal } from '@/components/ui/word-reveal'
import { cn } from '@/lib/utils'

interface Project {
  name: string
  tag: string
  url: string
  image: string
  bg: string
}

const PROJECTS: Project[] = [
  {
    name: 'Amiqui',
    tag: 'Web · Product',
    url: 'https://www.amiqui.com/',
    image: '/work-1.png',
    bg: 'linear-gradient(135deg, oklch(0.45 0.18 140) 0%, oklch(0.28 0.14 140) 100%)',
  },
  {
    name: 'StepsConnect',
    tag: 'Web · Platform',
    url: 'https://stepsconnect.com/',
    image: '/work-2.png',
    bg: 'linear-gradient(135deg, oklch(0.55 0.16 240) 0%, oklch(0.38 0.16 240) 100%)',
  },
]

interface SelectedWorkProps {
  // legacy props kept for back-compat with existing callers; ignored.
  topMountain?: boolean
  bottomMountain?: boolean
  eyebrow?: string
  titleLine1?: string
  titleLine2?: string
  /** Render placeholder cards instead of the real PROJECTS list. */
  placeholderOnly?: boolean
  /** Number of placeholder cards to show when placeholderOnly is true. */
  placeholderCount?: number
}

function BrowserFrame({
  url,
  image,
  alt,
  priority,
  sizes,
}: {
  url: string
  image: string
  alt: string
  priority?: boolean
  sizes?: string
}) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <div className="relative flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden bg-white/5 border border-white/15 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)]">
      <div className="absolute top-0 left-0 right-0 z-10 h-8 md:h-9 flex items-center px-3 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center px-4">
          <span className="px-3 py-0.5 rounded-full bg-white/10 text-[10px] md:text-[11px] font-mono text-white/70 truncate max-w-[80%]">
            {host}
          </span>
        </div>
      </div>
      <div className="absolute inset-0 pt-8 md:pt-9">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={image}
            alt={alt}
            width={1280}
            height={800}
            sizes={sizes}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            priority={priority}
            quality={80}
          />
        </div>
      </div>
    </div>
  )
}

export function SelectedWork({
  eyebrow = 'Selected Work',
  titleLine1 = 'From first commit',
  titleLine2 = 'to global scale.',
  placeholderOnly = false,
  placeholderCount = 3,
}: SelectedWorkProps) {
  const t = useTranslations()
  return (
    <section
      id="selected-work"
      className="relative bg-primary text-primary-foreground py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <Container>
        <div className="mb-12 md:mb-16 flex flex-col gap-4">
          <Reveal width="100%">
            <Typography variant="caption" className="!text-primary-foreground/70">
              {eyebrow}
            </Typography>
          </Reveal>
          <Typography variant="display" className="!text-primary-foreground">
            <WordReveal text={titleLine1} delay={0.1} />
            <br />
            <WordReveal text={titleLine2} delay={0.25} />
          </Typography>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
          style={{ gridAutoRows: 'minmax(420px, 1fr)' }}
        >
          {placeholderOnly &&
            Array.from({ length: placeholderCount }).map((_, i) => (
              <motion.div
                key={`placeholder-${i}`}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
              >
                <div className="h-full w-full rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center p-6">
                  <span
                    className={cn(
                      'font-heading font-bold uppercase tracking-tight text-primary-foreground/70 text-center text-xl md:text-2xl',
                    )}
                  >
                    {t('selected_work.placeholder')}
                  </span>
                </div>
              </motion.div>
            ))}

          {!placeholderOnly &&
            PROJECTS.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.name} — ${p.tag}`}
              className="group block h-full rounded-3xl overflow-hidden relative border border-white/10 transition-colors hover:border-white/30"
              style={{ background: p.bg }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
            >
              <svg
                viewBox="0 0 400 400"
                className="absolute -right-24 -top-24 w-[420px] h-[420px] opacity-15 pointer-events-none"
                aria-hidden
              >
                <circle cx="200" cy="200" r="180" fill="none" stroke="white" strokeWidth="0.6" />
                <circle cx="200" cy="200" r="130" fill="none" stroke="white" strokeWidth="0.6" />
                <circle cx="200" cy="200" r="80"  fill="none" stroke="white" strokeWidth="0.6" />
              </svg>

              <div className="relative h-full w-full p-6 md:p-7 flex flex-col gap-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[11px] tracking-widest opacity-80 uppercase">
                    {p.tag}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="opacity-70 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                    aria-hidden
                  />
                </div>

                <BrowserFrame
                  url={p.url}
                  image={p.image}
                  alt={`${p.name} — screenshot`}
                  priority={i === 0}
                  sizes="(min-width: 768px) 33vw, 100vw"
                />

                <Typography as="h3" variant="h4" className="!text-white">
                  {p.name}
                </Typography>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  )
}

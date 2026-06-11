'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/container'
import { Typography } from '@/components/ui/typography'

export function Footer() {
  const t = useTranslations()
  return (
    <footer className="relative w-full bg-background text-foreground overflow-hidden pt-32 transition-colors duration-300">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 items-start mb-24">
          <div className="md:col-span-3">
            <p className="mb-8 text-3xl md:text-[2.6rem] md:leading-[1.15] font-semibold tracking-[-0.025em] text-foreground">
              {t('footer.slogan_line1')} <br />
              <em className="font-display italic font-normal text-primary tracking-[-0.01em]">
                {t('footer.slogan_line2')}
              </em>
            </p>
          </div>

          <div className="md:col-span-1 flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t('footer.get_in_touch')}
            </span>
            <a
              href="mailto:hello@noxis.agency"
              className="hover:underline underline-offset-8 decoration-foreground transition-all"
            >
              <Typography as="span" variant="h4">hello@noxis.agency</Typography>
            </a>
          </div>
        </div>
      </Container>

      <div className="border-t border-border" />

      <Container className="relative z-10">
        <div className="relative pt-8 pb-4 overflow-hidden select-none pointer-events-none">
          <Image
            src="/logo.svg"
            alt=""
            width={2000}
            height={500}
            priority={false}
            className="w-full h-auto invert opacity-[0.05]"
          />
        </div>
      </Container>

      <div className="border-t border-border/50" />

      <Container className="relative z-10">
        <div className="min-h-[80px] flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span>© 2026 Andrea Zago</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>P.IVA 05668260283 · C.F. ZGANDR97C22B563E</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span>Via G. Mazzini 5a, 35010</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Trebaseleghe (PD), Italy</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}

'use client'

import FastMarquee from 'react-fast-marquee'
import { Container } from '@/components/layout/container'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

const Marquee = (FastMarquee as any).default || FastMarquee

const BRANDS = [
  { name: 'Accenture', logo: '/assets/accenture.png', className: 'h-20' },
  { name: 'Reply', logo: '/assets/reply.png', className: 'h-12 translate-y-[12px]' },
  { name: 'Generali', logo: '/assets/generali.png', className: 'h-6 translate-y-[8px]' },
]

export function BrandSlider() {
  return (
    <div className="w-full py-16 overflow-hidden relative">
      <Container variant="contained" className="mb-12">
        <Typography variant="caption">TRUSTED BY</Typography>
      </Container>

      <Marquee gradient={false} speed={50} pauseOnHover className="flex items-center">
        <div className="flex items-center gap-2 md:gap-40 pr-2 md:pr-40">
          {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className={cn(
                  'w-auto object-contain opacity-70 dark:invert transition-all duration-500 hover:opacity-100',
                  brand.className,
                )}
              />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  )
}

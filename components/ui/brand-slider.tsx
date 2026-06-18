import { Fragment } from 'react'
import { Container } from '@/components/layout/container'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

const BRANDS = [
  { name: 'Accenture', logo: '/assets/accenture.png', className: 'h-20' },
  { name: 'Reply', logo: '/assets/reply.png', className: 'h-12 translate-y-[12px]' },
  { name: 'Generali', logo: '/assets/generali.png', className: 'h-6 translate-y-[8px]' },
]

// Repeat the brands so a single copy fills the viewport: with only three logos
// the track would be far shorter than the quotes marquee below, so at the same
// 45s/-50% animation it would crawl and leave gaps. A wider track matches the
// quotes slider's perceived speed and keeps the loop seamless.
const TRACK = [...BRANDS, ...BRANDS, ...BRANDS]

interface BrandSliderProps {
  label?: string
  className?: string
}

export function BrandSlider({ label, className }: BrandSliderProps) {
  return (
    <div className={cn('w-full overflow-hidden py-10 md:py-14', className)}>
      {label && (
        <Container className="mb-12">
          <Typography variant="caption">{label}</Typography>
        </Container>
      )}

      <div
        aria-hidden
        className="relative overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="flex w-max items-center will-change-transform animate-[marquee_45s_linear_infinite] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <Fragment key={copy}>
              {TRACK.map((brand, i) => (
                <div
                  key={`${copy}-${i}`}
                  className="flex shrink-0 items-center justify-center px-10 md:px-20"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className={cn(
                      'w-auto object-contain opacity-40 brightness-0 invert transition-opacity duration-500 hover:opacity-100',
                      brand.className,
                    )}
                  />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

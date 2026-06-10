'use client'

import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/ui/reveal'
import { glass } from '@/lib/styles'
import { cn } from '@/lib/utils'

interface ImageBandProps {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

/** Banda fotografica a tutta colonna con caption glass. */
export function ImageBand({ src, alt, caption, width, height }: ImageBandProps) {
  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <Reveal width="100%" overflowVisible>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-28px_oklch(0_0_0/0.6)]">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="(min-width: 1024px) 90vw, 100vw"
                className="w-full h-auto max-h-[440px] object-cover object-center"
              />
            </div>
            {caption && (
              <div className={cn(glass, 'absolute -bottom-6 left-6 md:left-10 max-w-[85%] md:max-w-md rounded-2xl px-6 py-4')}>
                <span className="text-sm md:text-base font-medium tracking-tight text-foreground">
                  {caption}
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

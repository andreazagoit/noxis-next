'use client'

import FastMarquee from 'react-fast-marquee'

const Marquee = (FastMarquee as any).default || FastMarquee

const WORDS = ['Strategy', 'Match', 'Produce', 'Measure', 'Culture', 'Creative', 'Reach', 'Brand fit']

export function TalentMarquee() {
  return (
    <section className="relative py-12 md:py-16 bg-foreground text-background overflow-hidden">
      <Marquee gradient={false} speed={80} pauseOnHover className="flex items-center">
        <div className="flex items-center pr-6">
          {WORDS.map((w, i) => (
            <div key={i} className="flex items-center pr-6">
              <span className="font-heading text-[6vw] md:text-[4.5vw] lg:text-[4vw] leading-none uppercase tracking-tight">
                {w}
              </span>
              <span className="mx-6 md:mx-8 inline-block h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-primary" />
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  )
}

import { Fragment } from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  items: string[]
  className?: string
}

export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden py-10 md:py-14 select-none',
        '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]',
        className,
      )}
    >
      <div className="flex w-max items-baseline whitespace-nowrap will-change-transform animate-[marquee_45s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {items.map((item, i) => (
              <Fragment key={`${copy}-${i}`}>
                <span
                  className={cn(
                    'text-3xl md:text-5xl tracking-tight px-6 md:px-9',
                    i % 2 === 0
                      ? 'font-semibold text-foreground/[0.16]'
                      : 'font-display italic font-normal text-primary/25',
                  )}
                >
                  {item}
                </span>
                <span className="h-1.5 w-1.5 shrink-0 self-center rounded-full bg-primary/30" />
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

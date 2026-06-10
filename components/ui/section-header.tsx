'use client'

import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  accent?: string
  description?: string
  dark?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  dark = false,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal width="100%" className={cn('mb-14 md:mb-20', className)}>
      <div className="max-w-3xl">
        {eyebrow && (
          <span className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary/50" />
            {eyebrow}
          </span>
        )}
        <h2
          className={cn(
            'text-4xl md:text-[3.25rem] md:leading-[1.08] font-semibold tracking-[-0.025em]',
            dark ? 'text-background' : 'text-foreground',
          )}
        >
          {title}
          {accent && (
            <>
              {' '}
              <em className="font-display italic font-normal text-primary tracking-[-0.01em]">
                {accent}
              </em>
            </>
          )}
        </h2>
        {description && (
          <p
            className={cn(
              'mt-6 text-base md:text-lg leading-relaxed',
              dark ? 'text-background/70' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>
        )}
      </div>
    </Reveal>
  )
}

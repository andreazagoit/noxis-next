'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative p-8 md:p-10 rounded-3xl',
          'bg-white/15 dark:bg-black/20',
          'backdrop-blur-md',
          'border border-white/30 dark:border-white/10',
          'hover:border-white/50 dark:hover:border-white/20',
          'hover:bg-white/20 dark:hover:bg-black/30',
          'transition-all duration-300',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
GlassCard.displayName = 'GlassCard'

export { GlassCard }

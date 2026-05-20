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
          'bg-white/10',
          'backdrop-blur-md',
          'border border-white/20',
          'hover:border-white/40',
          'hover:bg-white/15',
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

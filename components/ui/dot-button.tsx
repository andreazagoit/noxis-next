'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Magnetic from '@/components/ui/magnetic'

export type DotButtonVariant = 'primary' | 'outline'

interface DotButtonProps {
  variant?: DotButtonVariant
  className?: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
}

const EASE = [0.16, 1, 0.3, 1] as const

type Tokens = {
  bg: string
  border: string
  textIdle: string
  textHover: string
  dotIdle: string
  dotHover: string
}

const VARIANTS: Record<DotButtonVariant, Tokens> = {
  primary: {
    bg: 'bg-foreground',
    border: 'border-0',
    textIdle: 'text-background',
    textHover: 'text-primary-foreground',
    dotIdle: 'bg-background',
    dotHover: 'bg-primary',
  },
  outline: {
    bg: 'bg-white',
    border: 'border border-foreground/15',
    textIdle: 'text-foreground',
    textHover: 'text-background',
    dotIdle: 'bg-foreground',
    dotHover: 'bg-primary',
  },
}

export function DotButton({
  variant = 'primary',
  className,
  children,
  onClick,
  type = 'button',
}: DotButtonProps) {
  const [hovered, setHovered] = useState(false)
  const tokens = VARIANTS[variant]

  return (
    <Magnetic>
      <motion.button
        type={type}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        initial={false}
        animate={{
          paddingLeft: hovered ? 24 : 48,
          paddingRight: hovered ? 48 : 24,
        }}
        transition={{ duration: hovered ? 0.6 : 0.45, ease: EASE }}
        className={cn(
          'relative inline-flex items-center rounded-full overflow-hidden cursor-pointer select-none',
          tokens.bg,
          tokens.border,
          'py-3.5 md:py-4',
          'text-xs md:text-sm font-bold uppercase tracking-[0.15em]',
          className,
        )}
      >
        {/* Fill layer: clipped to the idle dot, expands past the farthest corner on hover
            (percentage clip radii are relative to the element size, so any width is covered). */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            clipPath: hovered
              ? 'circle(150% at 24px 50%)'
              : 'circle(4px at 24px 50%)',
          }}
          transition={{ duration: hovered ? 0.7 : 0.5, ease: EASE }}
          className={cn(
            'absolute inset-0 transition-colors duration-500',
            hovered ? tokens.dotHover : tokens.dotIdle,
          )}
        />
        <span
          className={cn(
            'relative z-10 whitespace-nowrap transition-colors duration-500 ease-out',
            hovered ? tokens.textHover : tokens.textIdle,
          )}
        >
          {children}
        </span>
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 0 : 24,
          }}
          transition={{ duration: hovered ? 0.4 : 0.3, delay: hovered ? 0.2 : 0, ease: EASE }}
          className={cn(
            'absolute right-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center z-10 transition-colors duration-500 ease-out',
            hovered ? tokens.textHover : tokens.textIdle,
          )}
        >
          <ArrowRight size={18} className="shrink-0" />
        </motion.span>
      </motion.button>
    </Magnetic>
  )
}

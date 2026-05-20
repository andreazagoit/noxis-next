'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { CTAIntent } from '@/components/ui/cta-button'

export type DotSlideVariant = 'primary' | 'outline'

interface DotSlideButtonProps {
  email?: string
  intent?: CTAIntent
  variant?: DotSlideVariant
  className?: string
  children: React.ReactNode
}

const EASE = [0.16, 1, 0.3, 1] as const

type Tokens = {
  bg: string
  border: string
  text: string
  dot: string
  arrow: string
}

const VARIANTS: Record<DotSlideVariant, Tokens> = {
  primary: {
    bg: 'bg-foreground',
    border: 'border-0',
    text: 'text-background',
    dot: 'bg-background',
    arrow: 'text-background',
  },
  outline: {
    bg: 'bg-white',
    border: 'border border-foreground/15',
    text: 'text-foreground',
    dot: 'bg-foreground',
    arrow: 'text-foreground group-hover:text-primary-foreground transition-colors duration-300',
  },
}

export function DotSlideButton({
  email = 'hello@noxis.agency',
  intent,
  variant = 'primary',
  className,
  children,
}: DotSlideButtonProps) {
  const t = useTranslations()
  const [hovered, setHovered] = useState(false)
  const tokens = VARIANTS[variant]

  const handleClick = () => {
    if (!intent) return
    const subject = encodeURIComponent(t(`email.${intent}.subject`))
    const body = encodeURIComponent(t(`email.${intent}.body`))
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <motion.button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      initial={false}
      animate={{
        paddingLeft: hovered ? 48 : 24,
        paddingRight: hovered ? 24 : 48,
      }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        'relative inline-flex items-center rounded-full overflow-hidden cursor-pointer select-none group',
        'py-3.5 md:py-4',
        'text-xs md:text-sm font-bold uppercase tracking-[0.15em]',
        'transition-colors duration-300',
        variant === 'primary'
          ? 'bg-foreground hover:bg-primary text-background'
          : 'bg-white hover:bg-primary text-foreground hover:text-primary-foreground',
        tokens.border,
        className,
      )}
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ x: hovered ? 0 : -40, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          'absolute left-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center',
          tokens.arrow,
        )}
      >
        <ArrowRight size={18} className="shrink-0" />
      </motion.span>
      <span className="relative z-10 whitespace-nowrap">{children}</span>
      <motion.span
        aria-hidden
        initial={false}
        animate={{
          x: hovered ? 32 : 0,
          opacity: hovered ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: EASE }}
        className={cn(
          'absolute right-5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full',
          tokens.dot,
        )}
      />
    </motion.button>
  )
}

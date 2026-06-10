'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CleanButtonVariant = 'primary' | 'outline' | 'ghost'

interface CleanButtonProps {
  variant?: CleanButtonVariant
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  arrow?: boolean
  className?: string
  children: React.ReactNode
}

const VARIANT_CLASSES: Record<CleanButtonVariant, string> = {
  primary: cn(
    'bg-foreground text-background',
    'shadow-[0_1px_2px_oklch(0.145_0_0/0.2),0_12px_28px_-12px_oklch(0.145_0_0/0.45)]',
    'hover:bg-primary hover:text-primary-foreground',
    'hover:shadow-[0_1px_2px_oklch(0.705_0.213_47.6/0.3),0_16px_36px_-12px_oklch(0.705_0.213_47.6/0.55)]',
  ),
  outline: cn(
    'border border-foreground/15 bg-card/60 text-foreground backdrop-blur-sm',
    'shadow-[0_1px_2px_oklch(0.145_0_0/0.04)]',
    'hover:border-foreground hover:bg-foreground hover:text-background',
  ),
  ghost: 'text-foreground hover:text-primary underline-offset-8 hover:underline',
}

export function CleanButton({
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  arrow = false,
  className,
  children,
}: CleanButtonProps) {
  const classes = cn(
    'group inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4',
    'text-[0.95rem] font-medium tracking-[-0.01em] cursor-pointer select-none',
    'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:translate-y-0',
    VARIANT_CLASSES[variant],
    className,
  )
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          size={17}
          aria-hidden
          className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  )
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {content}
      </Link>
    )
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  )
}

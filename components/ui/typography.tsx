import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const typographyVariants = cva('', {
  variants: {
    variant: {
      hero: 'text-[13vw] md:text-[10vw] lg:text-[9vw] xl:text-[8.5vw] font-bold uppercase leading-[1.02] tracking-tight text-foreground',
      display:
        'text-[12vw] md:text-[8vw] lg:text-[6vw] font-bold uppercase leading-[0.95] tracking-tight text-foreground',
      h2: 'text-[7vw] md:text-[5vw] lg:text-[4vw] font-bold uppercase leading-[1] tracking-tight text-foreground',
      h3: 'text-[5vw] md:text-[3.5vw] lg:text-[2.5vw] font-bold uppercase leading-tight text-foreground',
      h4: 'text-lg md:text-xl font-bold tracking-tight leading-tight text-foreground',
      lead: 'text-lg md:text-xl lg:text-2xl font-medium leading-snug tracking-[-0.01em] text-muted-foreground',
      body: 'text-sm md:text-base leading-relaxed text-foreground',
      caption:
        'text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'body' },
})

type Variant = NonNullable<VariantProps<typeof typographyVariants>['variant']>

const elementByVariant: Record<Variant, ElementType> = {
  hero: 'h1',
  display: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  lead: 'p',
  body: 'p',
  caption: 'span',
}

type TypographyProps = {
  variant?: Variant
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<'p'>, 'children' | 'className'>

export function Typography({
  variant = 'body',
  className,
  ...props
}: TypographyProps) {
  const Component = elementByVariant[variant]
  return (
    <Component
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

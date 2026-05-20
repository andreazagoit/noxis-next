import * as React from 'react'
import { cn } from '@/lib/utils'

type ContainerVariant = 'default' | 'contained'

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: ContainerVariant
}

const variants: Record<ContainerVariant, string> = {
  default: 'w-full px-4 md:px-6 lg:px-8',
  contained: 'w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto',
}

export function Container({
  className,
  variant = 'default',
  ...props
}: ContainerProps) {
  return <div className={cn(variants[variant], className)} {...props} />
}

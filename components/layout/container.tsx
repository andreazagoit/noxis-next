import * as React from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = React.HTMLAttributes<HTMLDivElement>

// Single fixed-width column: content caps at 1240px and stays centered,
// with fixed gutters instead of viewport-relative padding.
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1240px] px-6 md:px-8', className)}
      {...props}
    />
  )
}

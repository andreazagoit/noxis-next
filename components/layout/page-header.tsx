import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

interface PageHeaderProps {
  back?: { href: string; label: string }
  eyebrow?: string
  title: string
  description?: ReactNode
  /** Right-side actions (buttons, dialogs, ...) */
  children?: ReactNode
}

export function PageHeader({
  back,
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  const hasTopRow = !!back || !!children

  return (
    <div
      className={cn(
        'sticky top-16 z-20',
        '-mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8',
        '-mt-4 md:-mt-6 lg:-mt-8 pt-4 md:pt-6 lg:pt-8 pb-4',
        'bg-background/80 backdrop-blur-md border-b border-border/60',
        'flex flex-col gap-4',
      )}
    >
      {hasTopRow && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {back ? (
              <Button asChild variant="ghost" size="sm" className="-ml-3">
                <Link href={back.href}>← {back.label}</Link>
              </Button>
            ) : null}
          </div>
          {children ? (
            <div className="flex items-center gap-2">{children}</div>
          ) : null}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {eyebrow ? (
          <Typography variant="caption" className="text-primary">
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h2">
          {title}
        </Typography>
        {description ? (
          <Typography variant="body" className="text-muted-foreground">
            {description}
          </Typography>
        ) : null}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Props {
  /** ISO date strings (YYYY-MM-DD) or null */
  startDate: string | null
  endDate: string | null
  onChange: (range: { startDate: string | null; endDate: string | null }) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function fmt(date: Date | undefined): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function toIsoDate(d: Date | undefined): string | null {
  if (!d) return null
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 10)
}

function fromIso(s: string | null): Date | undefined {
  return s ? new Date(s) : undefined
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = 'Pick a date range',
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false)

  const range: DateRange | undefined = startDate || endDate
    ? { from: fromIso(startDate), to: fromIso(endDate) }
    : undefined

  const label = (() => {
    if (!range?.from && !range?.to) return placeholder
    if (range.from && range.to) return `${fmt(range.from)}  →  ${fmt(range.to)}`
    if (range.from) return `${fmt(range.from)}  →  …`
    return `…  →  ${fmt(range.to)}`
  })()

  const handleSelect = (next: DateRange | undefined) => {
    onChange({
      startDate: toIsoDate(next?.from),
      endDate: toIsoDate(next?.to),
    })
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange({ startDate: null, endDate: null })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start font-normal',
            !range?.from && !range?.to && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4 opacity-70" />
          <span className="truncate flex-1 text-left">{label}</span>
          {(range?.from || range?.to) && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleClear(e as unknown as React.MouseEvent)
                }
              }}
              className="ml-2 rounded-full opacity-60 hover:opacity-100 transition-opacity text-xs cursor-pointer"
              aria-label="Clear date range"
            >
              ×
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          captionLayout="dropdown"
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

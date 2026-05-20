'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Props {
  /** ISO 8601 string (with time) or null */
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function fmtDate(d: Date | undefined): string {
  if (!d) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function fmtTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick date and time',
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const current = value ? new Date(value) : undefined

  const label = current ? `${fmtDate(current)} · ${fmtTime(current)}` : placeholder

  const handleDateSelect = (d: Date | undefined) => {
    if (!d) {
      onChange(null)
      return
    }
    const out = new Date(d)
    if (current) {
      out.setHours(current.getHours(), current.getMinutes(), 0, 0)
    } else {
      out.setHours(9, 0, 0, 0)
    }
    onChange(out.toISOString())
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!current) return
    const [h, m] = e.target.value.split(':').map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return
    const out = new Date(current)
    out.setHours(h, m, 0, 0)
    onChange(out.toISOString())
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start font-normal',
            !current && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4 opacity-70" />
          <span className="truncate flex-1 text-left">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={current}
          onSelect={handleDateSelect}
          captionLayout="dropdown"
          autoFocus
        />
        <div className="border-t border-border p-3 flex items-center gap-2">
          <label htmlFor="dtp-time" className="text-xs text-muted-foreground">
            Time
          </label>
          <Input
            id="dtp-time"
            type="time"
            value={current ? fmtTime(current) : ''}
            onChange={handleTimeChange}
            disabled={!current}
            className="w-32"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

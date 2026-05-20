'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface MultiComboboxItem {
  value: string
  label: string
  description?: string
}

interface Props {
  items: MultiComboboxItem[]
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

export function MultiCombobox({
  items,
  values,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results.',
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false)

  const selected = items.filter((i) => values.includes(i.value))
  const toggle = (val: string) => {
    if (values.includes(val)) onChange(values.filter((v) => v !== val))
    else onChange([...values, val])
  }

  const triggerLabel = (() => {
    if (values.length === 0) return placeholder
    if (values.length <= 2) return selected.map((s) => s.label).join(', ')
    return `${values.length} selected`
  })()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between font-normal', className)}
        >
          <span className={cn('truncate', values.length === 0 && 'text-muted-foreground')}>
            {triggerLabel}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => {
                  const isSelected = values.includes(item.value)
                  return (
                    <CommandItem
                      key={item.value}
                      value={`${item.label} ${item.description ?? ''}`}
                      onSelect={() => toggle(item.value)}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate">{item.label}</span>
                        {item.description ? (
                          <span className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </span>
                        ) : null}
                      </div>
                      <Check
                        className={cn(
                          'ml-auto size-4',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  )
}

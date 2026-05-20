'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, Building2 } from 'lucide-react'
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
import { setActiveOrganization } from '@/lib/models/member/operations'
import type { MyOrganization } from '@/lib/models/member/operations'

interface Props {
  organizations: MyOrganization[]
  activeOrganizationId: string | null
}

export function OrganizationSwitcher({ organizations, activeOrganizationId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const active = organizations.find((o) => o.id === activeOrganizationId) ?? null

  const handleSelect = (orgId: string) => {
    if (orgId === activeOrganizationId) {
      setOpen(false)
      return
    }
    startTransition(async () => {
      await setActiveOrganization(orgId)
      setOpen(false)
      router.refresh()
    })
  }

  if (organizations.length === 0) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={pending}
          className="w-full justify-between font-normal"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Building2 className="size-4 shrink-0 opacity-70" />
            <span className="truncate">
              {active ? active.name : 'Select organization'}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        side="top"
      >
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {organizations.map((o) => (
                <CommandItem
                  key={o.id}
                  value={`${o.name} ${o.role}`}
                  onSelect={() => handleSelect(o.id)}
                >
                  <div className="flex flex-col">
                    <span>{o.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {o.role}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto size-4',
                      activeOrganizationId === o.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

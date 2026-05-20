'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MultiCombobox } from '@/components/ui/multi-combobox'
import { Combobox } from '@/components/ui/combobox'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { createProject } from '@/lib/models/project/operations'
import {
  PROJECT_EVENT_TYPES,
  PROJECT_EVENT_TYPE_META,
  type ProjectEventType,
} from '@/lib/models/project/config'

type ItemDraft = {
  type: ProjectEventType
  title: string
  amount: string
  talentId: string
}

const newItem = (): ItemDraft => ({ type: 'post', title: '', amount: '', talentId: '' })

export function NewProjectDialog({
  organizations,
  talents,
}: {
  organizations: { id: string; name: string }[]
  talents: { id: string; label: string }[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [organizationIds, setOrganizationIds] = useState<string[]>([])
  const [brief, setBrief] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [items, setItems] = useState<ItemDraft[]>([])

  const reset = () => {
    setName('')
    setOrganizationIds([])
    setBrief('')
    setStartDate('')
    setEndDate('')
    setItems([])
    setError(null)
  }

  const onOpenChange = (next: boolean) => {
    if (!next) reset()
    setOpen(next)
  }

  const updateItem = (idx: number, patch: Partial<ItemDraft>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  }

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const total = items.reduce((sum, it) => {
    const v = parseFloat(it.amount)
    return sum + (isFinite(v) ? v : 0)
  }, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (organizationIds.length === 0) {
      setError('Pick at least one organization')
      return
    }
    const cleanItems = items
      .filter((it) => it.title.trim().length > 0)
      .map((it) => ({
        type: it.type,
        title: it.title.trim(),
        amountCents: it.amount ? Math.round(parseFloat(it.amount) * 100) : null,
        talentId: it.talentId || null,
      }))

    startTransition(async () => {
      const result = await createProject({
        name,
        organizationIds,
        brief: brief || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        items: cleanItems.length > 0 ? cleanItems : undefined,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setOpen(false)
      reset()
      router.push(`/dashboard/projects/${result.projectId}`)
      router.refresh()
    })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={organizations.length === 0}>
        New project
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              Set up a project brief for one of your organization clients.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            data-lenis-prevent
            className="flex flex-col gap-4 py-2 max-h-[65vh] overflow-y-auto pr-1"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Holiday 2026 launch"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Organizations</Label>
              <MultiCombobox
                items={organizations.map((o) => ({ value: o.id, label: o.name }))}
                values={organizationIds}
                onChange={setOrganizationIds}
                placeholder={
                  organizations.length === 0
                    ? 'No organizations available'
                    : 'Select organizations'
                }
                searchPlaceholder="Search organizations..."
                emptyMessage="No organization found."
                disabled={organizations.length === 0}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Planned window</Label>
              <DateRangePicker
                startDate={startDate || null}
                endDate={endDate || null}
                onChange={({ startDate: s, endDate: e }) => {
                  setStartDate(s ?? '')
                  setEndDate(e ?? '')
                }}
                placeholder="Pick start and end date"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="project-brief">Brief (optional)</Label>
              <Textarea
                id="project-brief"
                rows={3}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Goals, do/don't, hashtags, target audience..."
              />
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label>Items</Label>
                  <p className="text-xs text-muted-foreground">
                    Deliverables that make up this project. The sum is the project total.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setItems((prev) => [...prev, newItem()])}
                >
                  <Plus className="size-4" />
                  Add item
                </Button>
              </div>

              {items.length > 0 && (
                <div className="flex flex-col gap-3 mt-2">
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[8rem_1fr_auto] gap-2 items-start"
                    >
                      <Select
                        value={it.type}
                        onValueChange={(v) =>
                          updateItem(idx, { type: v as ProjectEventType })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_EVENT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {PROJECT_EVENT_TYPE_META[t].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-col gap-2">
                        <Input
                          value={it.title}
                          onChange={(e) => updateItem(idx, { title: e.target.value })}
                          placeholder="IG post #1"
                        />
                        <div className="grid grid-cols-[1fr_7rem] gap-2">
                          <Combobox
                            items={[
                              { value: '', label: '— Unassigned —' },
                              ...talents.map((t) => ({ value: t.id, label: t.label })),
                            ]}
                            value={it.talentId}
                            onChange={(v) => updateItem(idx, { talentId: v })}
                            placeholder="Assign talent"
                            searchPlaceholder="Search talents..."
                            emptyMessage="No talent found"
                          />
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={it.amount}
                            onChange={(e) => updateItem(idx, { amount: e.target.value })}
                            placeholder="€ 0.00"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(idx)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <span className="text-sm font-medium">
                      €{' '}
                      {total.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <Typography variant="caption" className="text-red-500">
                {error}
              </Typography>
            )}

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Creating...' : 'Create project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
import { Combobox } from '@/components/ui/combobox'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import {
  createProjectEvent,
  updateProjectEvent,
  deleteProjectEvent,
} from '@/lib/models/project/operations'
import {
  PROJECT_EVENT_TYPES,
  PROJECT_EVENT_PLATFORMS,
  PROJECT_EVENT_STATUSES,
  PROJECT_EVENT_TYPE_META,
  PROJECT_EVENT_PLATFORM_META,
  PROJECT_EVENT_STATUS_META,
} from '@/lib/models/project/config'
import type {
  DbProjectEvent,
  ProjectEventType,
  ProjectEventPlatform,
  ProjectEventStatus,
} from '@/lib/models'

interface EventDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: DbProjectEvent | null
  talents: { id: string; label: string }[]
}

function toDateTimeLocal(d: Date | null | undefined): string {
  if (!d) return ''
  const date = new Date(d)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function EventDialog({
  projectId,
  open,
  onOpenChange,
  event,
  talents,
}: EventDialogProps) {
  const router = useRouter()
  const isEdit = !!event
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState<ProjectEventType>('post')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [talentId, setTalentId] = useState<string>('')
  const [scheduled, setScheduled] = useState(true)
  const [scheduledAt, setScheduledAt] = useState('')
  const [platform, setPlatform] = useState<ProjectEventPlatform | ''>('')
  const [status, setStatus] = useState<ProjectEventStatus>('planned')
  const [url, setUrl] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (open && event) {
      setType(event.type)
      setTitle(event.title)
      setDescription(event.description ?? '')
      setTalentId(event.talentId ?? '')
      setScheduled(event.scheduledAt != null)
      setScheduledAt(toDateTimeLocal(event.scheduledAt))
      setPlatform(event.platform ?? '')
      setStatus(event.status)
      setUrl(event.url ?? '')
      setAmount(event.amountCents != null ? (event.amountCents / 100).toString() : '')
    } else if (open && !event) {
      setType('post')
      setTitle('')
      setDescription('')
      setTalentId('')
      setScheduled(true)
      setScheduledAt('')
      setPlatform('')
      setStatus('planned')
      setUrl('')
      setAmount('')
    }
    if (open) setError(null)
  }, [open, event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const payload = {
        type,
        title,
        description: description || undefined,
        talentId: talentId || null,
        scheduledAt: scheduled && scheduledAt ? new Date(scheduledAt).toISOString() : null,
        platform: (platform || null) as ProjectEventPlatform | null,
        status,
        url: url || null,
        amountCents: amount ? Math.round(parseFloat(amount) * 100) : null,
      }

      const result = isEdit
        ? await updateProjectEvent(event!.id, payload)
        : await createProjectEvent({ ...payload, projectId })

      if (!result.ok) {
        setError('error' in result ? String(result.error) : 'Error')
        return
      }
      onOpenChange(false)
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (!event) return
    if (!confirm(`Delete "${event.title}"?`)) return
    startTransition(async () => {
      await deleteProjectEvent(event.id)
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit event' : 'New event'}</DialogTitle>
          <DialogDescription>
            {PROJECT_EVENT_TYPE_META[type].description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} data-lenis-prevent className="flex flex-col gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ev-type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ProjectEventType)}>
                <SelectTrigger id="ev-type" className="w-full">
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
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ev-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ProjectEventStatus)}>
                <SelectTrigger id="ev-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_EVENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {PROJECT_EVENT_STATUS_META[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ev-title">Title</Label>
            <Input
              id="ev-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post IG launch #1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Talent (optional)</Label>
            <Combobox
              items={[
                { value: '', label: '— No talent —' },
                ...talents.map((t) => ({ value: t.id, label: t.label })),
              ]}
              value={talentId}
              onChange={setTalentId}
              placeholder="No talent assigned"
              searchPlaceholder="Search talents..."
              emptyMessage="No talent found"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={scheduled}
                onChange={(e) => setScheduled(e.target.checked)}
                className="size-4"
              />
              <span className="text-sm font-medium">Set a specific date and time</span>
            </label>
            <p className="text-xs text-muted-foreground">
              Uncheck to mark this as a floating to-do within the campaign window.
            </p>

            {scheduled && (
              <div className="flex flex-col gap-2 mt-2">
                <DateTimePicker
                  value={scheduledAt ? new Date(scheduledAt).toISOString() : null}
                  onChange={(v) => {
                    if (!v) {
                      setScheduledAt('')
                      return
                    }
                    const d = new Date(v)
                    const offset = d.getTimezoneOffset() * 60000
                    setScheduledAt(new Date(d.getTime() - offset).toISOString().slice(0, 16))
                  }}
                  placeholder="Pick date and time"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ev-platform">Platform (optional)</Label>
              <Select
                value={platform || 'none'}
                onValueChange={(v) =>
                  setPlatform(v === 'none' ? '' : (v as ProjectEventPlatform))
                }
              >
                <SelectTrigger id="ev-platform" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— None —</SelectItem>
                  {PROJECT_EVENT_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PROJECT_EVENT_PLATFORM_META[p].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ev-url">URL (if live)</Label>
              <Input
                id="ev-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ev-amount">Amount (EUR)</Label>
            <Input
              id="ev-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ev-desc">Description</Label>
            <Textarea
              id="ev-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what this event is about..."
            />
          </div>

          {error && (
            <Typography variant="caption" className="text-red-500">
              {error}
            </Typography>
          )}

          <DialogFooter className="mt-2">
            {isEdit && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                disabled={pending}
                className="text-red-500 mr-auto"
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving...' : isEdit ? 'Save changes' : 'Create event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

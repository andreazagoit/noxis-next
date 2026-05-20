'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { updateProject } from '@/lib/models/project/operations'
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
} from '@/lib/models/project/config'
import type { DbProject, ProjectStatus } from '@/lib/models'

function toDateInput(d: Date | null) {
  if (!d) return ''
  return new Date(d).toISOString().slice(0, 10)
}

export function ProjectForm({
  project,
  totalAmountCents,
}: {
  project: DbProject
  totalAmountCents: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [name, setName] = useState(project.name)
  const [brief, setBrief] = useState(project.brief ?? '')
  const [startDate, setStartDate] = useState(toDateInput(project.startDate))
  const [endDate, setEndDate] = useState(toDateInput(project.endDate))
  const [notes, setNotes] = useState(project.notes ?? '')
  const [status, setStatus] = useState<ProjectStatus>(project.status)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    startTransition(async () => {
      const result = await updateProject(project.id, {
        name,
        brief: brief || null,
        startDate: startDate || null,
        endDate: endDate || null,
        notes: notes || null,
        status,
      })
      if (!result.ok) {
        setMessage({ type: 'error', text: 'error' in result ? String(result.error) : 'Error' })
        return
      }
      setMessage({ type: 'success', text: 'Saved' })
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <Typography variant="h4">
          Overview
        </Typography>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {PROJECT_STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">Total budget</Label>
            <p className="text-xs text-muted-foreground">
              Sum of all event amounts. Edit individual items below to adjust.
            </p>
          </div>
          <p className="text-lg font-semibold">
            {totalAmountCents > 0
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(totalAmountCents / 100)
              : '—'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <Typography variant="h4">
          Brief
        </Typography>
        <Textarea
          rows={6}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Goals, do/don't, hashtags, target audience..."
        />
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <Typography variant="h4">
          Internal notes
        </Typography>
        <Textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Visible only to admins"
        />
      </div>

      {message && (
        <Typography
          variant="caption"
          className={message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}
        >
          {message.text}
        </Typography>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

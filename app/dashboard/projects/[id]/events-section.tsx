'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Typography } from '@/components/ui/typography'
import { EventDialog } from './event-dialog'
import type { DbProjectEvent } from '@/lib/models'

type EventWithTalent = {
  event: DbProjectEvent
  talent: { id: string; displayName: string; slug: string } | null
}

const STATUS_COLOR: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  planned: 'secondary',
  in_review: 'outline',
  approved: 'default',
  live: 'default',
  cancelled: 'destructive',
}

function monthKey(d: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d)
}

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

interface Props {
  projectId: string
  events: EventWithTalent[]
  talents: { id: string; label: string }[]
}

export function EventsSection({ projectId, events, talents }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<DbProjectEvent | null>(null)

  const scheduled = events.filter((e) => e.event.scheduledAt)
  const floating = events.filter((e) => !e.event.scheduledAt)

  const grouped = new Map<string, EventWithTalent[]>()
  for (const item of scheduled) {
    const key = monthKey(new Date(item.event.scheduledAt!))
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(item)
  }

  const openNew = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (event: DbProjectEvent) => {
    setEditing(event)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Typography variant="h4">
              Schedule
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              {events.length} {events.length === 1 ? 'event' : 'events'} total ·{' '}
              {floating.length} floating
            </Typography>
          </div>
          <Button onClick={openNew}>Add event</Button>
        </div>

        {events.length === 0 ? (
          <Typography
            variant="body"
            className="text-muted-foreground py-12 text-center border border-dashed border-border rounded-xl"
          >
            No events yet. Add the first one to start planning the campaign.
          </Typography>
        ) : (
          <div className="flex flex-col gap-6">
            {grouped.size > 0 && (
              <div className="flex flex-col gap-4">
                {[...grouped.entries()].map(([month, items]) => (
                  <div key={month} className="flex flex-col gap-2">
                    <Typography
                      variant="caption"
                      className="text-muted-foreground tracking-widest"
                    >
                      {month}
                    </Typography>
                    <ul className="flex flex-col gap-2">
                      {items.map(({ event, talent }) => (
                        <li key={event.id}>
                          <button
                            onClick={() => openEdit(event)}
                            className="w-full text-left rounded-xl border border-border px-4 py-3 hover:border-primary/40 hover:bg-accent/30 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="text-xs">
                                    {event.type}
                                  </Badge>
                                  {event.platform && (
                                    <Badge variant="secondary" className="text-xs">
                                      {event.platform}
                                    </Badge>
                                  )}
                                  <span className="text-sm font-medium truncate">
                                    {event.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{formatDateTime(new Date(event.scheduledAt!))}</span>
                                  {talent && (
                                    <>
                                      <span>·</span>
                                      <span>@{talent.slug}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Badge variant={STATUS_COLOR[event.status] ?? 'default'}>
                                {event.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {floating.length > 0 && (
              <div className="flex flex-col gap-2">
                <Typography
                  variant="caption"
                  className="text-muted-foreground tracking-widest"
                >
                  To do within the campaign window
                </Typography>
                <ul className="flex flex-col gap-2">
                  {floating.map(({ event, talent }) => (
                    <li key={event.id}>
                      <button
                        onClick={() => openEdit(event)}
                        className="w-full text-left rounded-xl border border-dashed border-border px-4 py-3 hover:border-primary/40 hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                              {event.platform && (
                                <Badge variant="secondary" className="text-xs">
                                  {event.platform}
                                </Badge>
                              )}
                              <span className="text-sm font-medium truncate">
                                {event.title}
                              </span>
                            </div>
                            {talent && (
                              <div className="text-xs text-muted-foreground">
                                @{talent.slug}
                              </div>
                            )}
                          </div>
                          <Badge variant={STATUS_COLOR[event.status] ?? 'default'}>
                            {event.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <EventDialog
        projectId={projectId}
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next)
          if (!next) setEditing(null)
        }}
        event={editing}
        talents={talents}
      />
    </>
  )
}

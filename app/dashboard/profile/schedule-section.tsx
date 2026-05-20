import { Badge } from '@/components/ui/badge'
import { Typography } from '@/components/ui/typography'
import type { ProjectEventRow } from '@/lib/models/project/operations'

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

export function ScheduleSection({ events }: { events: ProjectEventRow[] }) {
  const scheduled = events.filter((e) => e.event.scheduledAt)
  const floating = events.filter((e) => !e.event.scheduledAt)

  const grouped = new Map<string, ProjectEventRow[]>()
  for (const item of scheduled) {
    const key = monthKey(new Date(item.event.scheduledAt!))
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(item)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
      <div>
        <Typography variant="h4">
          Your schedule
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          {events.length} {events.length === 1 ? 'event' : 'events'} assigned to you
        </Typography>
      </div>

      {events.length === 0 ? (
        <Typography
          variant="body"
          className="text-muted-foreground py-8 text-center border border-dashed border-border rounded-xl"
        >
          You don't have any events assigned yet. The agency will set them up when a campaign starts.
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
                    {items.map(({ event, project, organizations }) => (
                      <li
                        key={event.id}
                        className="rounded-xl border border-border px-4 py-3"
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
                              {organizations.length > 0 && project && (
                                <>
                                  <span>·</span>
                                  <span>
                                    {organizations.map(o => o.name).join(' × ')} — {project.name}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <Badge variant={STATUS_COLOR[event.status] ?? 'default'}>
                            {event.status.replace('_', ' ')}
                          </Badge>
                        </div>
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
                To do (no specific date)
              </Typography>
              <ul className="flex flex-col gap-2">
                {floating.map(({ event, project, organizations }) => (
                  <li
                    key={event.id}
                    className="rounded-xl border border-dashed border-border px-4 py-3"
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
                        {organizations.length > 0 && project && (
                          <div className="text-xs text-muted-foreground">
                            {organizations.map(o => o.name).join(' × ')} — {project.name}
                          </div>
                        )}
                      </div>
                      <Badge variant={STATUS_COLOR[event.status] ?? 'default'}>
                        {event.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

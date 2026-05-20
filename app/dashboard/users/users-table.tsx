'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Typography } from '@/components/ui/typography'
import type { UserKind, UserListRow } from '@/lib/models/user/operations'
import { UserDetailDialog } from './user-detail-dialog'

const KIND_LABEL: Record<UserKind | 'all', string> = {
  all: 'All',
  admin: 'Admins',
  talent: 'Talents',
  user: 'Users',
}

const KIND_BADGE: Record<UserKind, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  talent: 'secondary',
  user: 'outline',
}

export function UsersTable({ users }: { users: UserListRow[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tab, setTab] = useState<'all' | UserKind>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const byTab = tab === 'all' ? users : users.filter((u) => u.kind === tab)
    const q = query.trim().toLowerCase()
    if (!q) return byTab
    return byTab.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.organizations.some((o) => o.name.toLowerCase().includes(q)),
    )
  }, [users, tab, query])

  const counts = useMemo(
    () => ({
      all: users.length,
      admin: users.filter((u) => u.kind === 'admin').length,
      talent: users.filter((u) => u.kind === 'talent').length,
      user: users.filter((u) => u.kind === 'user').length,
    }),
    [users],
  )

  const renderTable = (rows: UserListRow[]) =>
    rows.length === 0 ? (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-12 text-center">
        <Typography variant="body" className="text-muted-foreground">
          No users in this view.
        </Typography>
      </div>
    ) : (
      <div className="rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Organizations</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant={KIND_BADGE[u.kind]}>{u.kind}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {u.organizations.length > 0
                    ? u.organizations.map((o) => o.name).join(', ')
                    : '—'}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedId(u.id)}>
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, organization..."
            className="pl-9"
          />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="all">
              {KIND_LABEL.all} <span className="ml-1.5 opacity-60">{counts.all}</span>
            </TabsTrigger>
            <TabsTrigger value="admin">
              {KIND_LABEL.admin} <span className="ml-1.5 opacity-60">{counts.admin}</span>
            </TabsTrigger>
            <TabsTrigger value="talent">
              {KIND_LABEL.talent} <span className="ml-1.5 opacity-60">{counts.talent}</span>
            </TabsTrigger>
            <TabsTrigger value="user">
              {KIND_LABEL.user} <span className="ml-1.5 opacity-60">{counts.user}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {renderTable(filtered)}

      <UserDetailDialog
        userId={selectedId}
        open={!!selectedId}
        onOpenChange={(next) => {
          if (!next) setSelectedId(null)
        }}
      />
    </div>
  )
}

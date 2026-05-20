'use client'

import { useState } from 'react'
import { Settings, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { OrganizationSummary } from '@/lib/models/organization/operations'
import { OrganizationDetailsDialog } from './organization-details-dialog'
import { OrganizationTeamDialog } from './organization-team-dialog'

export function OrganizationsTable({
  organizations,
}: {
  organizations: OrganizationSummary[]
}) {
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)

  return (
    <>
      <div className="rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.name}</TableCell>
                <TableCell>{b.memberCount}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(b.createdAt).toLocaleDateString('en-GB')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDetailsId(b.id)}
                      title="Details"
                      aria-label="Details"
                    >
                      <Settings className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTeamId(b.id)}
                      title="Team"
                      aria-label="Team"
                    >
                      <Users className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrganizationDetailsDialog
        organizationId={detailsId}
        open={!!detailsId}
        onOpenChange={(next) => {
          if (!next) setDetailsId(null)
        }}
      />

      <OrganizationTeamDialog
        organizationId={teamId}
        open={!!teamId}
        onOpenChange={(next) => {
          if (!next) setTeamId(null)
        }}
      />
    </>
  )
}

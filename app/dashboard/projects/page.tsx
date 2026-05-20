import Link from 'next/link'
import { requireAdmin } from '@/lib/auth-utils'
import { listProjects } from '@/lib/models/project/operations'
import { listOrganizations } from '@/lib/models/organization/operations'
import { listTalents } from '@/lib/models/talent/operations'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/components/layout/page-header'
import { NewProjectDialog } from './new-project-dialog'

const STATUS_COLOR: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  draft: 'secondary',
  proposed: 'outline',
  approved: 'default',
  in_progress: 'default',
  completed: 'outline',
  archived: 'destructive',
}

function formatBudget(cents: number) {
  if (cents === 0) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export default async function ProjectsPage() {
  await requireAdmin()
  const [projects, organizations, talents] = await Promise.all([
    listProjects(),
    listOrganizations(),
    listTalents(),
  ])
  const talentOptions = talents.map((t) => ({
    id: t.profile.id,
    label: `${t.profile.displayName} (@${t.profile.slug})`,
  }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Projects"
      >
        <NewProjectDialog
          organizations={organizations.map((b) => ({ id: b.id, name: b.name }))}
          talents={talentOptions}
        />
      </PageHeader>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
          <Typography variant="h4">
            No projects yet
          </Typography>
          <Typography variant="body" className="text-muted-foreground max-w-sm">
            {organizations.length === 0
              ? 'Add a organization first, then you can launch your first project.'
              : 'Create your first project for one of your organization clients.'}
          </Typography>
          {organizations.length === 0 ? (
            <Button asChild className="mt-2" variant="outline">
              <Link href="/dashboard/organizations">Go to organizations</Link>
            </Button>
          ) : (
            <div className="mt-2">
              <NewProjectDialog
                organizations={organizations.map((b) => ({ id: b.id, name: b.name }))}
                talents={talentOptions}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Organizations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Planned</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(({ project, organizations, totalAmountCents }) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {organizations.length > 0
                      ? organizations.map((o) => o.name).join(' × ')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLOR[project.status] ?? 'default'}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatBudget(totalAmountCents)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString('en-GB')
                      : '—'}
                    {project.endDate
                      ? ` → ${new Date(project.endDate).toLocaleDateString('en-GB')}`
                      : ''}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/projects/${project.id}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

import { requireAdmin } from '@/lib/auth-utils'
import { listOrganizations } from '@/lib/models/organization/operations'
import { Typography } from '@/components/ui/typography'
import { PageHeader } from '@/components/layout/page-header'
import { NewOrganizationDialog } from './new-organization-dialog'
import { OrganizationsTable } from './organizations-table'

export default async function OrganizationsPage() {
  await requireAdmin()
  const organizations = await listOrganizations()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Organizations"
      >
        <NewOrganizationDialog />
      </PageHeader>

      {organizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
          <Typography variant="h4">
            No organizations yet
          </Typography>
          <Typography variant="body" className="text-muted-foreground max-w-sm">
            Add a organization client to start running projects.
          </Typography>
          <div className="mt-2">
            <NewOrganizationDialog />
          </div>
        </div>
      ) : (
        <OrganizationsTable organizations={organizations} />
      )}
    </div>
  )
}

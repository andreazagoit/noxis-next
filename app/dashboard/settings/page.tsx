import { requireSession } from '@/lib/auth-utils'
import { Typography } from '@/components/ui/typography'
import { PageHeader } from '@/components/layout/page-header'

export default async function SettingsPage() {
  const session = await requireSession()
  const role = (session.user as { role?: string }).role ?? 'user'

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <PageHeader
        title="Settings"
        description="Account and platform preferences."
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <Typography variant="h4">
          Account
        </Typography>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="md:col-span-2">{session.user.name}</dd>

          <dt className="text-muted-foreground">Email</dt>
          <dd className="md:col-span-2">{session.user.email}</dd>

          <dt className="text-muted-foreground">Role</dt>
          <dd className="md:col-span-2">
            <code className="text-xs bg-secondary px-2 py-1 rounded">{role}</code>
          </dd>
        </dl>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-12 text-center">
        <Typography variant="body" className="text-muted-foreground">
          More settings coming soon (notifications, integrations, security).
        </Typography>
      </div>
    </div>
  )
}

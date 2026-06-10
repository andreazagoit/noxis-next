import { getCurrentSession, isAdmin } from '@/lib/auth-utils'
import { listLeads } from '@/lib/models/lead/operations'
import { LeadsTable } from './leads-table'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getCurrentSession()

  if (!isAdmin(session)) {
    return (
      <p className="text-sm text-muted-foreground">
        Quest&apos;area è riservata all&apos;amministratore.
      </p>
    )
  }

  const leads = await listLeads()

  return (
    <LeadsTable
      leads={leads.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
      }))}
    />
  )
}

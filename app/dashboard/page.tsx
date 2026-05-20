import { requireSession, getUserRole } from '@/lib/auth-utils'
import { listMyEvents } from '@/lib/models/project/operations'
import { PageHeader } from '@/components/layout/page-header'
import { ScheduleSection } from '@/app/dashboard/profile/schedule-section'

export default async function DashboardPage() {
  const session = await requireSession()
  const role = getUserRole(session)
  const events = await listMyEvents()

  const description =
    role === 'admin'
      ? 'All scheduled and floating events across every project.'
      : 'Everything assigned to you and to your organization projects.'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Schedule" description={description} />
      <ScheduleSection events={events} />
    </div>
  )
}

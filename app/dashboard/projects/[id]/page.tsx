import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth-utils'
import {
  getProjectById,
  listProjectEvents,
} from '@/lib/models/project/operations'
import { listTalents } from '@/lib/models/talent/operations'
import { PageHeader } from '@/components/layout/page-header'
import { ProjectForm } from './project-form'
import { EventsSection } from './events-section'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const data = await getProjectById(id)
  if (!data) notFound()

  const [eventRows, talents] = await Promise.all([
    listProjectEvents(id),
    listTalents(),
  ])

  const events = eventRows.map(({ event, talent }) => ({ event, talent }))
  const talentOptions = talents.map((t) => ({
    id: t.profile.id,
    label: `${t.profile.displayName} (@${t.profile.slug})`,
  }))

  const orgsLabel =
    data.organizations.length > 0
      ? data.organizations.map((o) => o.name).join(' × ')
      : 'No organization'

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <PageHeader
        back={{ href: '/dashboard/projects', label: 'Projects' }}
        title={data.project.name}
        description={orgsLabel}
      />

      <ProjectForm project={data.project} totalAmountCents={data.totalAmountCents} />

      <EventsSection
        projectId={data.project.id}
        events={events}
        talents={talentOptions}
      />
    </div>
  )
}

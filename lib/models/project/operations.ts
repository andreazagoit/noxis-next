'use server'

import { randomUUID } from 'node:crypto'
import { eq, desc, asc, inArray, or, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  project,
  projectOrganization,
  projectEvent,
  organization,
  member,
  talentProfile,
} from '@/lib/models'
import type {
  ProjectStatus,
  ProjectEventStatus,
  ProjectEventType,
  ProjectEventPlatform,
} from '@/lib/models/project/config'
import {
  ProjectCreateSchema,
  ProjectUpdateSchema,
  ProjectEventCreateSchema,
  ProjectEventUpdateSchema,
  type ProjectCreateInput,
  type ProjectUpdateInput,
  type ProjectEventCreateInput,
  type ProjectEventUpdateInput,
} from '@/lib/models/project/validator'
import { requireAdmin, requireSession, getUserRole } from '@/lib/auth-utils'

// ════════════════════════════════════════════════════════════════════
// PROJECT
// ════════════════════════════════════════════════════════════════════

export interface ProjectWithOrganizations {
  project: typeof project.$inferSelect
  organizations: { id: string; name: string; slug: string }[]
  totalAmountCents: number
}

async function attachOrganizations(
  projects: (typeof project.$inferSelect)[],
): Promise<ProjectWithOrganizations[]> {
  if (projects.length === 0) return []
  const ids = projects.map((p) => p.id)

  const links = await db
    .select({
      projectId: projectOrganization.projectId,
      orgId: organization.id,
      orgName: organization.name,
      orgSlug: organization.slug,
    })
    .from(projectOrganization)
    .innerJoin(organization, eq(projectOrganization.organizationId, organization.id))
    .where(inArray(projectOrganization.projectId, ids))

  const byProject = new Map<string, { id: string; name: string; slug: string }[]>()
  for (const l of links) {
    if (!byProject.has(l.projectId)) byProject.set(l.projectId, [])
    byProject.get(l.projectId)!.push({ id: l.orgId, name: l.orgName, slug: l.orgSlug })
  }

  const events = await db
    .select({
      projectId: projectEvent.projectId,
      amountCents: projectEvent.amountCents,
    })
    .from(projectEvent)
    .where(inArray(projectEvent.projectId, ids))
  const totalsByProject = new Map<string, number>()
  for (const e of events) {
    totalsByProject.set(
      e.projectId,
      (totalsByProject.get(e.projectId) ?? 0) + (e.amountCents ?? 0),
    )
  }

  return projects.map((p) => ({
    project: p,
    organizations: byProject.get(p.id) ?? [],
    totalAmountCents: totalsByProject.get(p.id) ?? 0,
  }))
}

export async function listProjects(): Promise<ProjectWithOrganizations[]> {
  await requireAdmin()
  const projects = await db.select().from(project).orderBy(desc(project.createdAt))
  return attachOrganizations(projects)
}

export async function getProjectById(id: string): Promise<ProjectWithOrganizations | null> {
  await requireAdmin()
  const found = await db.query.project.findFirst({ where: eq(project.id, id) })
  if (!found) return null
  const [withOrgs] = await attachOrganizations([found])
  return withOrgs ?? null
}

export async function createProject(input: ProjectCreateInput) {
  await requireAdmin()
  const data = ProjectCreateSchema.parse(input)

  // Verify all orgs exist
  const orgs = await db
    .select({ id: organization.id })
    .from(organization)
    .where(inArray(organization.id, data.organizationIds))
  if (orgs.length !== data.organizationIds.length) {
    return { ok: false, error: 'Some organizations were not found' as const }
  }

  const id = randomUUID()
  await db.transaction(async (tx) => {
    await tx.insert(project).values({
      id,
      name: data.name,
      brief: data.brief,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: 'draft',
    })
    await tx.insert(projectOrganization).values(
      data.organizationIds.map((organizationId) => ({
        projectId: id,
        organizationId,
      })),
    )
    if (data.items && data.items.length > 0) {
      await tx.insert(projectEvent).values(
        data.items.map((item) => ({
          id: randomUUID(),
          projectId: id,
          type: item.type,
          title: item.title,
          amountCents: item.amountCents ?? null,
          talentId: item.talentId ?? null,
          status: 'planned' as const,
        })),
      )
    }
  })

  return { ok: true, projectId: id } as const
}

export async function updateProject(id: string, input: ProjectUpdateInput) {
  await requireAdmin()
  const data = ProjectUpdateSchema.parse(input)

  const patch: Partial<typeof project.$inferInsert> & { updatedAt: Date } = {
    updatedAt: new Date(),
  }
  if (data.name !== undefined) patch.name = data.name
  if (data.brief !== undefined) patch.brief = data.brief
  if (data.startDate !== undefined)
    patch.startDate = data.startDate ? new Date(data.startDate) : null
  if (data.endDate !== undefined)
    patch.endDate = data.endDate ? new Date(data.endDate) : null
  if (data.notes !== undefined) patch.notes = data.notes
  if (data.status !== undefined) patch.status = data.status

  await db.update(project).set(patch).where(eq(project.id, id))
  return { ok: true } as const
}

export async function setProjectStatus(id: string, status: ProjectStatus) {
  await requireAdmin()
  await db
    .update(project)
    .set({ status, updatedAt: new Date() })
    .where(eq(project.id, id))
  return { ok: true } as const
}

export async function deleteProject(id: string) {
  await requireAdmin()
  await db.delete(project).where(eq(project.id, id))
  return { ok: true } as const
}

export async function setProjectOrganizations(projectId: string, organizationIds: string[]) {
  await requireAdmin()
  if (organizationIds.length === 0) {
    return { ok: false, error: 'At least one organization is required' as const }
  }
  await db.transaction(async (tx) => {
    await tx.delete(projectOrganization).where(eq(projectOrganization.projectId, projectId))
    await tx.insert(projectOrganization).values(
      organizationIds.map((organizationId) => ({ projectId, organizationId })),
    )
  })
  return { ok: true } as const
}

// ════════════════════════════════════════════════════════════════════
// PROJECT EVENT
// ════════════════════════════════════════════════════════════════════

export interface ProjectEventRow {
  event: typeof projectEvent.$inferSelect
  talent: { id: string; displayName: string; slug: string } | null
  project: { id: string; name: string } | null
  organizations: { id: string; name: string }[]
}

async function selectEventsWithJoins(whereClause?: ReturnType<typeof eq>) {
  let q = db
    .select({
      event: projectEvent,
      talentId: talentProfile.id,
      talentDisplayName: talentProfile.displayName,
      talentSlug: talentProfile.slug,
      projectId: project.id,
      projectName: project.name,
    })
    .from(projectEvent)
    .leftJoin(talentProfile, eq(projectEvent.talentId, talentProfile.id))
    .leftJoin(project, eq(projectEvent.projectId, project.id))
    .$dynamic()

  if (whereClause) q = q.where(whereClause)
  return q.orderBy(asc(projectEvent.scheduledAt))
}

async function mapEventRows(
  rows: Awaited<ReturnType<typeof selectEventsWithJoins>>,
): Promise<ProjectEventRow[]> {
  const projectIds = Array.from(
    new Set(rows.map((r) => r.projectId).filter((x): x is string => !!x)),
  )

  let orgsByProject = new Map<string, { id: string; name: string }[]>()
  if (projectIds.length > 0) {
    const links = await db
      .select({
        projectId: projectOrganization.projectId,
        orgId: organization.id,
        orgName: organization.name,
      })
      .from(projectOrganization)
      .innerJoin(organization, eq(projectOrganization.organizationId, organization.id))
      .where(inArray(projectOrganization.projectId, projectIds))
    for (const l of links) {
      if (!orgsByProject.has(l.projectId)) orgsByProject.set(l.projectId, [])
      orgsByProject.get(l.projectId)!.push({ id: l.orgId, name: l.orgName })
    }
  }

  return rows.map((r) => ({
    event: r.event,
    talent: r.talentId
      ? { id: r.talentId, displayName: r.talentDisplayName!, slug: r.talentSlug! }
      : null,
    project: r.projectId ? { id: r.projectId, name: r.projectName! } : null,
    organizations: r.projectId ? orgsByProject.get(r.projectId) ?? [] : [],
  }))
}

export async function listProjectEvents(projectId: string): Promise<ProjectEventRow[]> {
  await requireAdmin()
  const rows = await selectEventsWithJoins(eq(projectEvent.projectId, projectId))
  return mapEventRows(rows)
}

export async function listMyEvents(): Promise<ProjectEventRow[]> {
  const session = await requireSession()
  const admin = getUserRole(session) === 'admin'

  if (admin) {
    const rows = await selectEventsWithJoins()
    return mapEventRows(rows)
  }

  const profile = await db.query.talentProfile.findFirst({
    where: eq(talentProfile.userId, session.user.id),
  })

  const memberships = await db
    .select({ organizationId: member.organizationId })
    .from(member)
    .where(eq(member.userId, session.user.id))
  const orgIds = memberships.map((m) => m.organizationId)

  // Projects user can see via brand memberships (any project involving any of their orgs)
  let orgProjectIds: string[] = []
  if (orgIds.length > 0) {
    const links = await db
      .select({ projectId: projectOrganization.projectId })
      .from(projectOrganization)
      .where(inArray(projectOrganization.organizationId, orgIds))
    orgProjectIds = Array.from(new Set(links.map((l) => l.projectId)))
  }

  const filters: ReturnType<typeof eq>[] = []
  if (profile) filters.push(eq(projectEvent.talentId, profile.id))
  if (orgProjectIds.length > 0)
    filters.push(inArray(projectEvent.projectId, orgProjectIds) as never)

  if (filters.length === 0) return []
  const rows = await selectEventsWithJoins(
    filters.length === 1 ? filters[0] : (or(...filters) as never),
  )
  return mapEventRows(rows)
}

export async function getProjectEventById(id: string) {
  await requireAdmin()
  return db.query.projectEvent.findFirst({ where: eq(projectEvent.id, id) })
}

export async function createProjectEvent(input: ProjectEventCreateInput) {
  await requireAdmin()
  const data = ProjectEventCreateSchema.parse(input)
  const id = randomUUID()
  await db.insert(projectEvent).values({
    id,
    projectId: data.projectId,
    talentId: data.talentId ?? null,
    type: data.type,
    title: data.title,
    description: data.description ?? null,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    platform: data.platform ?? null,
    status: data.status,
    amountCents: data.amountCents ?? null,
    url: data.url ?? null,
    notes: data.notes ?? null,
  })
  return { ok: true, eventId: id } as const
}

export async function updateProjectEvent(id: string, input: ProjectEventUpdateInput) {
  await requireAdmin()
  const data = ProjectEventUpdateSchema.parse(input)

  const patch: Partial<typeof projectEvent.$inferInsert> & { updatedAt: Date } = {
    updatedAt: new Date(),
  }
  if (data.talentId !== undefined) patch.talentId = data.talentId
  if (data.type !== undefined) patch.type = data.type as ProjectEventType
  if (data.title !== undefined) patch.title = data.title
  if (data.description !== undefined) patch.description = data.description
  if (data.scheduledAt !== undefined)
    patch.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null
  if (data.platform !== undefined)
    patch.platform = data.platform as ProjectEventPlatform | null
  if (data.status !== undefined) patch.status = data.status as ProjectEventStatus
  if (data.amountCents !== undefined) patch.amountCents = data.amountCents
  if (data.url !== undefined) patch.url = data.url
  if (data.notes !== undefined) patch.notes = data.notes

  await db.update(projectEvent).set(patch).where(eq(projectEvent.id, id))
  return { ok: true } as const
}

export async function deleteProjectEvent(id: string) {
  await requireAdmin()
  await db.delete(projectEvent).where(eq(projectEvent.id, id))
  return { ok: true } as const
}

export async function setProjectEventStatus(id: string, status: ProjectEventStatus) {
  await requireAdmin()
  await db
    .update(projectEvent)
    .set({ status, updatedAt: new Date() })
    .where(eq(projectEvent.id, id))
  return { ok: true } as const
}

void and

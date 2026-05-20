'use server'

import { eq, ne, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { member, organization, session as sessionTable } from '@/lib/models'
import { requireSession, getUserRole } from '@/lib/auth-utils'

export interface MyOrganization {
  id: string
  name: string
  slug: string
  role: string
}

export async function listMyOrganizations(): Promise<MyOrganization[]> {
  const session = await requireSession()
  const rows = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      role: member.role,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(and(eq(member.userId, session.user.id), ne(organization.slug, 'noxis')))
  return rows
}

export async function setActiveOrganization(organizationId: string | null) {
  const session = await requireSession()

  if (organizationId !== null) {
    const role = getUserRole(session)
    if (role !== 'admin') {
      const m = await db.query.member.findFirst({
        where: and(
          eq(member.userId, session.user.id),
          eq(member.organizationId, organizationId),
        ),
      })
      if (!m) {
        return { ok: false, error: 'Not a member of this organization' as const }
      }
    }
  }

  await db
    .update(sessionTable)
    .set({ activeOrganizationId: organizationId })
    .where(eq(sessionTable.id, session.session.id))

  return { ok: true } as const
}

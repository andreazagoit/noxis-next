'use server'

import { randomUUID } from 'node:crypto'
import { eq, ne, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { user, talentProfile, member, organization } from '@/lib/models'
import {
  UserCreateSchema,
  UserUpdateSchema,
  type UserCreateInput,
  type UserUpdateInput,
} from '@/lib/models/user/validator'
import { requireAdmin } from '@/lib/auth-utils'

export type UserKind = 'admin' | 'talent' | 'user'

export interface UserListRow {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  kind: UserKind
  talent: { id: string; slug: string; displayName: string } | null
  organizations: { id: string; name: string }[]
  createdAt: Date
}

export async function listUsers(filter?: UserKind): Promise<UserListRow[]> {
  await requireAdmin()

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      talentId: talentProfile.id,
      talentSlug: talentProfile.slug,
      talentDisplayName: talentProfile.displayName,
    })
    .from(user)
    .leftJoin(talentProfile, eq(talentProfile.userId, user.id))
    .orderBy(desc(user.createdAt))

  const orgLinks = await db
    .select({
      userId: member.userId,
      orgId: organization.id,
      orgName: organization.name,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(ne(organization.slug, 'noxis'))

  const orgsByUser = new Map<string, { id: string; name: string }[]>()
  for (const l of orgLinks) {
    if (!orgsByUser.has(l.userId)) orgsByUser.set(l.userId, [])
    orgsByUser.get(l.userId)!.push({ id: l.orgId, name: l.orgName })
  }

  const result: UserListRow[] = rows.map((r) => {
    const kind: UserKind =
      r.role === 'admin' ? 'admin' : r.talentId ? 'talent' : 'user'
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      image: r.image,
      role: r.role,
      kind,
      talent: r.talentId
        ? { id: r.talentId, slug: r.talentSlug!, displayName: r.talentDisplayName! }
        : null,
      organizations: orgsByUser.get(r.id) ?? [],
      createdAt: r.createdAt,
    }
  })

  if (!filter) return result
  return result.filter((r) => r.kind === filter)
}

export async function getUserById(id: string) {
  await requireAdmin()
  const found = await db.query.user.findFirst({ where: eq(user.id, id) })
  if (!found) return null
  const profile = await db.query.talentProfile.findFirst({
    where: eq(talentProfile.userId, id),
  })
  const orgLinks = await db
    .select({
      memberId: member.id,
      orgId: organization.id,
      orgName: organization.name,
      role: member.role,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, id))

  return {
    user: found,
    talent: profile ?? null,
    memberships: orgLinks,
  }
}

export async function createUser(input: UserCreateInput) {
  await requireAdmin()
  const data = UserCreateSchema.parse(input)

  const existing = await db.query.user.findFirst({ where: eq(user.email, data.email) })
  if (existing) {
    return { ok: false, error: 'A user with this email already exists' as const }
  }

  const id = randomUUID()
  await db.insert(user).values({
    id,
    email: data.email,
    name: data.name,
    emailVerified: true,
    role: data.role,
  })
  return { ok: true, userId: id } as const
}

export async function updateUser(id: string, input: UserUpdateInput) {
  await requireAdmin()
  const data = UserUpdateSchema.parse(input)
  await db
    .update(user)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(user.id, id))
  return { ok: true } as const
}

export async function deleteUser(id: string) {
  await requireAdmin()
  await db.delete(user).where(eq(user.id, id))
  return { ok: true } as const
}

export async function searchUsersByQuery(q: string): Promise<UserListRow[]> {
  await requireAdmin()
  // simple in-memory search after fetching all; fine for small/medium datasets
  const all = await listUsers()
  const norm = q.trim().toLowerCase()
  if (!norm) return all
  return all.filter(
    (u) =>
      u.name.toLowerCase().includes(norm) || u.email.toLowerCase().includes(norm),
  )
}

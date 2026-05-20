'use server'

import { randomUUID } from 'node:crypto'
import { eq, ne, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { organization, member, user } from '@/lib/models'
import {
  OrganizationCreateSchema,
  OrganizationUpdateSchema,
  AddOrganizationMemberSchema,
  type OrganizationCreateInput,
  type OrganizationUpdateInput,
  type AddOrganizationMemberInput,
} from '@/lib/models/organization/validator'
import { requireAdmin } from '@/lib/auth-utils'

const NOXIS_SLUG = 'noxis'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60)
}

async function uniqueSlug(base: string): Promise<string> {
  const candidate = base || `brand-${Date.now()}`
  const existing = await db.query.organization.findFirst({
    where: eq(organization.slug, candidate),
  })
  if (!existing) return candidate
  return uniqueSlug(`${candidate}-${Math.floor(Math.random() * 1000)}`)
}

// ────────────────────────────────────────────────────────────────────
// BRAND QUERIES
// ────────────────────────────────────────────────────────────────────

export interface OrganizationSummary {
  id: string
  name: string
  slug: string
  logo: string | null
  createdAt: Date
  memberCount: number
}

export async function listOrganizations(): Promise<OrganizationSummary[]> {
  await requireAdmin()
  const rows = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
      createdAt: organization.createdAt,
    })
    .from(organization)
    .where(ne(organization.slug, NOXIS_SLUG))
    .orderBy(organization.createdAt)

  const summaries: OrganizationSummary[] = []
  for (const row of rows) {
    const members = await db
      .select({ id: member.id })
      .from(member)
      .where(eq(member.organizationId, row.id))
    summaries.push({ ...row, memberCount: members.length })
  }
  return summaries
}

export async function getOrganizationById(id: string) {
  await requireAdmin()
  return db.query.organization.findFirst({ where: eq(organization.id, id) })
}

export interface OrganizationMember {
  memberId: string
  userId: string
  name: string
  email: string
  image: string | null
  role: string
  createdAt: Date
}

export async function listOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  await requireAdmin()
  const rows = await db
    .select({
      memberId: member.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: member.role,
      createdAt: member.createdAt,
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(eq(member.organizationId, organizationId))
    .orderBy(member.createdAt)
  return rows
}

// ────────────────────────────────────────────────────────────────────
// BRAND MUTATIONS
// ────────────────────────────────────────────────────────────────────

export async function createOrganization(input: OrganizationCreateInput) {
  await requireAdmin()
  const data = OrganizationCreateSchema.parse(input)

  const baseSlug = data.slug ?? slugify(data.name)
  if (baseSlug === NOXIS_SLUG) {
    return { ok: false, error: 'Slug "noxis" is reserved' as const }
  }
  const slug = await uniqueSlug(baseSlug)
  const id = randomUUID()
  await db.insert(organization).values({ id, name: data.name, slug })
  return { ok: true, organizationId: id } as const
}

export async function updateOrganization(id: string, input: OrganizationUpdateInput) {
  await requireAdmin()
  const data = OrganizationUpdateSchema.parse(input)

  if (data.slug !== undefined) {
    if (data.slug === NOXIS_SLUG) {
      return { ok: false, error: 'Slug "noxis" is reserved' as const }
    }
    const conflict = await db.query.organization.findFirst({
      where: eq(organization.slug, data.slug),
    })
    if (conflict && conflict.id !== id) {
      return { ok: false, error: 'Slug already in use' as const }
    }
  }

  await db.update(organization).set(data).where(eq(organization.id, id))
  return { ok: true } as const
}

export async function deleteOrganization(id: string) {
  await requireAdmin()
  const org = await db.query.organization.findFirst({ where: eq(organization.id, id) })
  if (!org) return { ok: false, error: 'Organization not found' as const }
  if (org.slug === NOXIS_SLUG) {
    return { ok: false, error: 'Cannot delete the Noxis organization' as const }
  }
  await db.delete(organization).where(eq(organization.id, id))
  return { ok: true } as const
}

export async function addExistingUserToOrganization(input: {
  organizationId: string
  userId: string
  role?: 'owner' | 'admin' | 'member'
}) {
  await requireAdmin()
  const { organizationId, userId, role = 'member' } = input

  const org = await db.query.organization.findFirst({
    where: eq(organization.id, organizationId),
  })
  if (!org) return { ok: false, error: 'Organization not found' as const }

  const existingUser = await db.query.user.findFirst({ where: eq(user.id, userId) })
  if (!existingUser) return { ok: false, error: 'User not found' as const }

  const existingMember = await db.query.member.findFirst({
    where: and(
      eq(member.userId, userId),
      eq(member.organizationId, organizationId),
    ),
  })
  if (existingMember) {
    return { ok: false, error: 'User already a member of this organization' as const }
  }

  await db.insert(member).values({
    id: randomUUID(),
    organizationId,
    userId,
    role,
  })
  return { ok: true } as const
}

export async function addOrganizationMember(input: AddOrganizationMemberInput) {
  await requireAdmin()
  const data = AddOrganizationMemberSchema.parse(input)

  const org = await db.query.organization.findFirst({
    where: eq(organization.id, data.organizationId),
  })
  if (!org) return { ok: false, error: 'Organization not found' as const }

  let userId: string
  const existingUser = await db.query.user.findFirst({ where: eq(user.email, data.email) })

  if (existingUser) {
    userId = existingUser.id
    const existingMember = await db.query.member.findFirst({
      where: and(
        eq(member.userId, existingUser.id),
        eq(member.organizationId, data.organizationId),
      ),
    })
    if (existingMember) {
      return { ok: false, error: 'User already a member of this organization' as const }
    }
  } else {
    userId = randomUUID()
    await db.insert(user).values({
      id: userId,
      email: data.email,
      name: data.name,
      emailVerified: true,
      role: 'user',
    })
  }

  await db.insert(member).values({
    id: randomUUID(),
    organizationId: data.organizationId,
    userId,
    role: data.role,
  })

  return { ok: true } as const
}

export async function removeOrganizationMember(memberId: string) {
  await requireAdmin()
  await db.delete(member).where(eq(member.id, memberId))
  return { ok: true } as const
}

'use server'

import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  user,
  talentProfile,
  talentSocial,
  type TalentStatus,
} from '@/lib/models'
import {
  TalentCreateSchema,
  TalentUpdateSchema,
  TalentAdminUpdateSchema,
  TalentSocialItemSchema,
  type TalentCreateInput,
  type TalentAdminUpdateInput,
  type TalentSocialItemInput,
} from '@/lib/models/talent/validator'
import { z } from 'zod'
import { requireAdmin, requireSession, getUserRole } from '@/lib/auth-utils'
import { sendEmail } from '@/lib/email'

// ────────────────────────────────────────────────────────────────────
// QUERIES (reads — exposed as server actions, callable from any caller)
// Each one enforces its own auth.
// ────────────────────────────────────────────────────────────────────

export async function getTalentById(talentId: string) {
  await requireAdmin()
  return db.query.talentProfile.findFirst({
    where: eq(talentProfile.id, talentId),
  })
}

export async function getTalentByUserId(userId: string) {
  const session = await requireSession()
  const admin = getUserRole(session) === 'admin'
  if (!admin && session.user.id !== userId) {
    return null
  }
  return db.query.talentProfile.findFirst({
    where: eq(talentProfile.userId, userId),
  })
}

export async function getTalentBySlug(slug: string) {
  // Public-ish read: returns only fields safe for any caller.
  const row = await db.query.talentProfile.findFirst({
    where: eq(talentProfile.slug, slug),
  })
  if (!row) return null
  const { notes, ...rest } = row
  void notes
  return rest
}

export interface TalentWithUser {
  profile: typeof talentProfile.$inferSelect
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export async function listTalents(): Promise<TalentWithUser[]> {
  await requireAdmin()
  const rows = await db
    .select({
      profile: talentProfile,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    })
    .from(talentProfile)
    .innerJoin(user, eq(talentProfile.userId, user.id))
    .orderBy(talentProfile.createdAt)

  return rows.map((row) => ({
    profile: row.profile,
    user: {
      id: row.userId,
      name: row.userName,
      email: row.userEmail,
      image: row.userImage,
    },
  }))
}

export async function getTalentWithUser(talentId: string): Promise<TalentWithUser | null> {
  await requireAdmin()
  const rows = await db
    .select({
      profile: talentProfile,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    })
    .from(talentProfile)
    .innerJoin(user, eq(talentProfile.userId, user.id))
    .where(eq(talentProfile.id, talentId))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  return {
    profile: row.profile,
    user: {
      id: row.userId,
      name: row.userName,
      email: row.userEmail,
      image: row.userImage,
    },
  }
}

// ────────────────────────────────────────────────────────────────────
// MUTATIONS
// ────────────────────────────────────────────────────────────────────

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
  const candidate = base || `talent-${Date.now()}`
  const existing = await db.query.talentProfile.findFirst({
    where: eq(talentProfile.slug, candidate),
  })
  if (!existing) return candidate
  return uniqueSlug(`${candidate}-${Math.floor(Math.random() * 1000)}`)
}

export async function createTalent(input: TalentCreateInput) {
  await requireAdmin()
  const data = TalentCreateSchema.parse(input)

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, data.email),
  })
  if (existingUser) {
    return { ok: false, error: 'A user with this email already exists' as const }
  }

  const displayName = data.displayName ?? data.name
  const baseSlug = data.slug ?? slugify(displayName)
  const slug = await uniqueSlug(baseSlug)

  const userId = randomUUID()
  const profileId = randomUUID()

  await db.transaction(async (tx) => {
    await tx.insert(user).values({
      id: userId,
      email: data.email,
      name: data.name,
      emailVerified: true,
      role: 'user',
    })
    await tx.insert(talentProfile).values({
      id: profileId,
      userId,
      slug,
      displayName,
      bio: data.bio || null,
      city: data.city || null,
      country: data.country || null,
      fiscalCode: data.fiscalCode || null,
      vatNumber: data.vatNumber || null,
      address: data.address || null,
      pec: data.pec || null,
      sdiCode: data.sdiCode || null,
      billingEmail: data.billingEmail || null,
      iban: data.iban || null,
      status: 'draft',
    })

    if (data.socials.length > 0) {
      await tx.insert(talentSocial).values(
        data.socials.map((s) => ({
          id: randomUUID(),
          talentId: profileId,
          platform: s.platform,
          handle: s.handle,
          url: s.url ?? null,
        })),
      )
    }
  })

  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
  await sendEmail({
    to: data.email,
    subject: 'Welcome to Noxis',
    html: welcomeTalentEmailHtml({
      name: displayName,
      signInUrl: `${baseUrl}/sign-in`,
    }),
  })

  return { ok: true, talentId: profileId, userId } as const
}

export async function updateTalent(talentId: string, input: TalentAdminUpdateInput) {
  const session = await requireSession()
  const admin = getUserRole(session) === 'admin'

  const profile = await db.query.talentProfile.findFirst({
    where: eq(talentProfile.id, talentId),
  })
  if (!profile) return { ok: false, error: 'Talent not found' as const }

  if (!admin && profile.userId !== session.user.id) {
    return { ok: false, error: 'Forbidden' as const }
  }

  const data = admin ? TalentAdminUpdateSchema.parse(input) : TalentUpdateSchema.parse(input)

  if (data.slug && data.slug !== profile.slug) {
    const conflict = await db.query.talentProfile.findFirst({
      where: eq(talentProfile.slug, data.slug),
    })
    if (conflict && conflict.id !== profile.id) {
      return { ok: false, error: 'Slug already taken' as const }
    }
  }

  await db
    .update(talentProfile)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(talentProfile.id, talentId))

  return { ok: true } as const
}

export async function setTalentStatus(talentId: string, status: TalentStatus) {
  await requireAdmin()
  await db
    .update(talentProfile)
    .set({ status, updatedAt: new Date() })
    .where(eq(talentProfile.id, talentId))
  return { ok: true } as const
}

// ────────────────────────────────────────────────────────────────────
// SOCIALS
// ────────────────────────────────────────────────────────────────────

export async function listTalentSocials(talentId: string) {
  await requireSession()
  return db
    .select()
    .from(talentSocial)
    .where(eq(talentSocial.talentId, talentId))
    .orderBy(talentSocial.createdAt)
}

export async function setTalentSocials(
  talentId: string,
  socials: TalentSocialItemInput[],
) {
  const session = await requireSession()
  const admin = getUserRole(session) === 'admin'

  const profile = await db.query.talentProfile.findFirst({
    where: eq(talentProfile.id, talentId),
  })
  if (!profile) return { ok: false, error: 'Talent not found' as const }
  if (!admin && profile.userId !== session.user.id) {
    return { ok: false, error: 'Forbidden' as const }
  }

  const data = z.array(TalentSocialItemSchema).parse(socials)

  await db.transaction(async (tx) => {
    await tx.delete(talentSocial).where(eq(talentSocial.talentId, talentId))
    if (data.length > 0) {
      await tx.insert(talentSocial).values(
        data.map((s) => ({
          id: randomUUID(),
          talentId,
          platform: s.platform,
          handle: s.handle,
          url: s.url ?? null,
        })),
      )
    }
  })

  return { ok: true } as const
}

// ────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATE
// ────────────────────────────────────────────────────────────────────

function welcomeTalentEmailHtml({
  name,
  signInUrl,
}: {
  name: string
  signInUrl: string
}) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #ededed;">
  <h1 style="font-size: 18px; margin: 0 0 16px;">Welcome, ${name}</h1>
  <p style="font-size: 14px; opacity: 0.7; margin: 0 0 24px;">Your Noxis Talent profile has been created. Sign in with your email — we'll send you a one-time code.</p>
  <a href="${signInUrl}" style="display: inline-block; padding: 12px 24px; background: #ededed; color: #0a0a0a; border-radius: 8px; font-weight: 600; text-decoration: none;">Sign in</a>
</body>
</html>`.trim()
}

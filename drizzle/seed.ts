/**
 * Seed script — creates the first admin user and the Noxis organization.
 * Idempotent: safe to re-run.
 *
 * Usage: npm run db:seed
 *
 * Auth model: OTP-only. The admin signs in by requesting an email OTP at /sign-in.
 * No password is involved.
 */
import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { user, organization, member } from '@/lib/models'

const SEED_EMAIL = process.env.SEED_ADMIN_EMAIL

const NOXIS_ORG_NAME = 'Noxis'
const NOXIS_ORG_SLUG = 'noxis'

async function ensureAdminUser() {
  if (!SEED_EMAIL) {
    throw new Error('SEED_ADMIN_EMAIL must be set in .env.local')
  }

  const existing = await db.query.user.findFirst({
    where: eq(user.email, SEED_EMAIL),
  })

  if (existing) {
    if (existing.role !== 'admin') {
      await db.update(user).set({ role: 'admin' }).where(eq(user.id, existing.id))
      console.log(`✓ Promoted existing user ${SEED_EMAIL} to admin`)
    } else {
      console.log(`✓ Admin user ${SEED_EMAIL} already exists`)
    }
    return existing.id
  }

  const id = randomUUID()
  await db.insert(user).values({
    id,
    email: SEED_EMAIL,
    name: SEED_EMAIL.split('@')[0],
    emailVerified: true,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  console.log(`✓ Created admin user ${SEED_EMAIL}`)
  return id
}

async function ensureNoxisOrganization(adminUserId: string) {
  const existing = await db.query.organization.findFirst({
    where: eq(organization.slug, NOXIS_ORG_SLUG),
  })

  let orgId: string
  if (existing) {
    orgId = existing.id
    console.log(`✓ Organization "${NOXIS_ORG_NAME}" already exists`)
  } else {
    orgId = randomUUID()
    await db.insert(organization).values({
      id: orgId,
      name: NOXIS_ORG_NAME,
      slug: NOXIS_ORG_SLUG,
      createdAt: new Date(),
    })
    console.log(`✓ Created organization "${NOXIS_ORG_NAME}"`)
  }

  const existingMember = await db.query.member.findFirst({
    where: eq(member.userId, adminUserId),
  })

  if (existingMember && existingMember.organizationId === orgId) {
    if (existingMember.role !== 'admin') {
      await db.update(member).set({ role: 'admin' }).where(eq(member.id, existingMember.id))
      console.log(`✓ Promoted membership of ${SEED_EMAIL} to admin`)
    } else {
      console.log(`✓ ${SEED_EMAIL} already admin of "${NOXIS_ORG_NAME}"`)
    }
    return
  }

  await db.insert(member).values({
    id: randomUUID(),
    organizationId: orgId,
    userId: adminUserId,
    role: 'admin',
    createdAt: new Date(),
  })
  console.log(`✓ Added ${SEED_EMAIL} as admin of "${NOXIS_ORG_NAME}"`)
}

async function main() {
  console.log('→ Seeding database...')
  const adminUserId = await ensureAdminUser()
  await ensureNoxisOrganization(adminUserId)
  console.log('✅ Seed complete. Sign in at /sign-in with email OTP.')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

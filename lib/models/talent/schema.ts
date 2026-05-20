import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from '@/lib/models/user/schema'
import { TALENT_STATUSES, TALENT_SOCIAL_PLATFORMS } from '@/lib/models/talent/config'

export type { TalentStatus, TalentSocialPlatform } from '@/lib/models/talent/config'

export const talentStatus = pgEnum('talent_status', TALENT_STATUSES)
export const talentSocialPlatform = pgEnum(
  'talent_social_platform',
  TALENT_SOCIAL_PLATFORMS,
)

export const talentProfile = pgTable('talent_profile', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull().unique(),
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  city: text('city'),
  country: text('country'),
  // Billing / legal info (individuals — full name lives on `user.name`)
  fiscalCode: text('fiscal_code'),
  vatNumber: text('vat_number'),
  address: text('address'),
  pec: text('pec'),
  sdiCode: text('sdi_code'),
  billingEmail: text('billing_email'),
  iban: text('iban'),
  status: talentStatus('status').notNull().default('draft'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const talentSocial = pgTable('talent_social', {
  id: text('id').primaryKey(),
  talentId: text('talent_id')
    .notNull()
    .references(() => talentProfile.id, { onDelete: 'cascade' }),
  platform: talentSocialPlatform('platform').notNull(),
  handle: text('handle').notNull(),
  url: text('url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type DbTalentProfile = typeof talentProfile.$inferSelect
export type DbTalentProfileInsert = typeof talentProfile.$inferInsert
export type DbTalentSocial = typeof talentSocial.$inferSelect
export type DbTalentSocialInsert = typeof talentSocial.$inferInsert

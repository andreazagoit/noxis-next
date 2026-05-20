import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { TALENT_SOCIAL_PLATFORMS } from '@/lib/models/talent/config'

// Re-use the same platform values as talent socials so we have one taxonomy.
export const organizationSocialPlatform = pgEnum(
  'organization_social_platform',
  TALENT_SOCIAL_PLATFORMS,
)

export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  metadata: text('metadata'),
  // Billing / legal info (brands)
  legalName: text('legal_name'),
  country: text('country'),
  address: text('address'),
  vatNumber: text('vat_number'),
  pec: text('pec'),
  sdiCode: text('sdi_code'),
  billingEmail: text('billing_email'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const organizationSocial = pgTable('organization_social', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  platform: organizationSocialPlatform('platform').notNull(),
  handle: text('handle').notNull(),
  url: text('url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type DbOrganization = typeof organization.$inferSelect
export type DbOrganizationInsert = typeof organization.$inferInsert
export type DbOrganizationSocial = typeof organizationSocial.$inferSelect
export type DbOrganizationSocialInsert = typeof organizationSocial.$inferInsert

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from '@/lib/models/user/schema'
import { organization } from '@/lib/models/organization/schema'

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type DbMember = typeof member.$inferSelect

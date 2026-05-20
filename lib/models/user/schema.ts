import { pgEnum, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['admin', 'user'])

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: userRole('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type UserRole = (typeof userRole.enumValues)[number]
export type DbUser = typeof user.$inferSelect
export type DbUserInsert = typeof user.$inferInsert

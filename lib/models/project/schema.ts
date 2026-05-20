import { pgEnum, pgTable, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core'
import { organization } from '@/lib/models/organization/schema'
import { talentProfile } from '@/lib/models/talent/schema'
import {
  PROJECT_STATUSES,
  PROJECT_EVENT_TYPES,
  PROJECT_EVENT_PLATFORMS,
  PROJECT_EVENT_STATUSES,
} from '@/lib/models/project/config'

// Re-export the value types from config for consumer convenience
export type {
  ProjectStatus,
  ProjectEventType,
  ProjectEventPlatform,
  ProjectEventStatus,
} from '@/lib/models/project/config'

// ────────────────────────────────────────────────────────────────────
// PROJECT
// ────────────────────────────────────────────────────────────────────

export const projectStatus = pgEnum('project_status', PROJECT_STATUSES)

export const project = pgTable('project', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brief: text('brief'),
  status: projectStatus('status').notNull().default('draft'),
  // Total budget is computed as sum(project_event.amountCents) — not stored.
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type DbProject = typeof project.$inferSelect
export type DbProjectInsert = typeof project.$inferInsert

// ────────────────────────────────────────────────────────────────────
// PROJECT ⇄ ORGANIZATION (many-to-many)
// A project can involve multiple participating organizations (client + partners + ...).
// ────────────────────────────────────────────────────────────────────

export const projectOrganization = pgTable(
  'project_organization',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.projectId, t.organizationId] }) }),
)

export type DbProjectOrganization = typeof projectOrganization.$inferSelect

// ────────────────────────────────────────────────────────────────────
// PROJECT EVENT
// ────────────────────────────────────────────────────────────────────

export const projectEventType = pgEnum('project_event_type', PROJECT_EVENT_TYPES)
export const projectEventPlatform = pgEnum('project_event_platform', PROJECT_EVENT_PLATFORMS)
export const projectEventStatus = pgEnum('project_event_status', PROJECT_EVENT_STATUSES)

export const projectEvent = pgTable('project_event', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  talentId: text('talent_id').references(() => talentProfile.id, { onDelete: 'set null' }),
  type: projectEventType('type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  scheduledAt: timestamp('scheduled_at'),
  platform: projectEventPlatform('platform'),
  status: projectEventStatus('status').notNull().default('planned'),
  // Item cost in cents. Visible to all viewers. Sum across events = project total.
  amountCents: integer('amount_cents'),
  url: text('url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type DbProjectEvent = typeof projectEvent.$inferSelect
export type DbProjectEventInsert = typeof projectEvent.$inferInsert

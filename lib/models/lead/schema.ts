import { pgEnum, pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import {
  LEAD_SOURCES,
  LEAD_SECTORS,
  LEAD_EMPLOYEE_BANDS,
  LEAD_STATUSES,
} from '@/lib/models/lead/config'

export type { LeadSource, LeadSector, LeadEmployeeBand, LeadStatus } from '@/lib/models/lead/config'

// ────────────────────────────────────────────────────────────────────
// LEAD
// Captured from the public site (AI Readiness Check). No auth involved.
// ────────────────────────────────────────────────────────────────────

export const leadSource = pgEnum('lead_source', LEAD_SOURCES)
export const leadSector = pgEnum('lead_sector', LEAD_SECTORS)
export const leadEmployeeBand = pgEnum('lead_employee_band', LEAD_EMPLOYEE_BANDS)
export const leadStatus = pgEnum('lead_status', LEAD_STATUSES)

export const lead = pgTable('lead', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  sector: leadSector('sector'),
  employees: leadEmployeeBand('employees'),
  score: integer('score'),
  // Raw check answers as a JSON-encoded array of 0|1|2, kept for follow-up context.
  answers: text('answers'),
  locale: text('locale'),
  source: leadSource('source').notNull().default('ai-check'),
  status: leadStatus('status').notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type DbLead = typeof lead.$inferSelect
export type DbLeadInsert = typeof lead.$inferInsert

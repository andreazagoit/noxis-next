import { z } from 'zod'
import {
  PROJECT_STATUSES,
  PROJECT_EVENT_TYPES,
  PROJECT_EVENT_PLATFORMS,
  PROJECT_EVENT_STATUSES,
} from '@/lib/models/project/config'

// ────────────────────────────────────────────────────────────────────
// PROJECT
// ────────────────────────────────────────────────────────────────────

export const ProjectCreateSchema = z.object({
  name: z.string().min(1).max(200),
  organizationIds: z.array(z.string()).min(1),
  brief: z.string().max(8000).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  items: z
    .array(
      z.object({
        type: z.enum(PROJECT_EVENT_TYPES),
        title: z.string().min(1).max(200),
        amountCents: z.number().int().nonnegative().nullable().optional(),
        talentId: z.string().nullable().optional(),
      }),
    )
    .optional(),
})

export const ProjectUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  brief: z.string().max(8000).nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  notes: z.string().max(8000).nullable().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
})

export type ProjectCreateInput = z.input<typeof ProjectCreateSchema>
export type ProjectUpdateInput = z.input<typeof ProjectUpdateSchema>

// ────────────────────────────────────────────────────────────────────
// PROJECT EVENT
// ────────────────────────────────────────────────────────────────────

export const ProjectEventCreateSchema = z.object({
  projectId: z.string(),
  talentId: z.string().nullable().optional(),
  type: z.enum(PROJECT_EVENT_TYPES),
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  scheduledAt: z.string().nullable().optional(),
  platform: z.enum(PROJECT_EVENT_PLATFORMS).nullable().optional(),
  status: z.enum(PROJECT_EVENT_STATUSES).default('planned'),
  amountCents: z.number().int().nonnegative().nullable().optional(),
  url: z.url().nullable().optional(),
  notes: z.string().max(4000).nullable().optional(),
})

export const ProjectEventUpdateSchema = z.object({
  talentId: z.string().nullable().optional(),
  type: z.enum(PROJECT_EVENT_TYPES).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(4000).nullable().optional(),
  scheduledAt: z.string().nullable().optional(),
  platform: z.enum(PROJECT_EVENT_PLATFORMS).nullable().optional(),
  status: z.enum(PROJECT_EVENT_STATUSES).optional(),
  amountCents: z.number().int().nonnegative().nullable().optional(),
  url: z.url().nullable().optional(),
  notes: z.string().max(4000).nullable().optional(),
})

export type ProjectEventCreateInput = z.input<typeof ProjectEventCreateSchema>
export type ProjectEventUpdateInput = z.input<typeof ProjectEventUpdateSchema>

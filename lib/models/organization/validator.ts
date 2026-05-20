import { z } from 'zod'
import { ORGANIZATION_MEMBER_ROLES } from '@/lib/models/member/config'

const slugRegex = /^[a-z0-9-]+$/

export const OrganizationCreateSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(2).max(60).regex(slugRegex).optional(),
})

export const OrganizationUpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  slug: z.string().min(2).max(60).regex(slugRegex).optional(),
  logo: z.string().max(500).nullable().optional(),
  legalName: z.string().max(200).nullable().optional(),
  country: z.string().max(2).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  vatNumber: z.string().max(40).nullable().optional(),
  pec: z.string().max(120).nullable().optional(),
  sdiCode: z.string().max(20).nullable().optional(),
  billingEmail: z.email().nullable().optional(),
  notes: z.string().max(4000).nullable().optional(),
})

export const AddOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  email: z.email(),
  name: z.string().min(1).max(120),
  role: z.enum(ORGANIZATION_MEMBER_ROLES).default('member'),
})

export type OrganizationCreateInput = z.input<typeof OrganizationCreateSchema>
export type OrganizationUpdateInput = z.input<typeof OrganizationUpdateSchema>
export type AddOrganizationMemberInput = z.input<typeof AddOrganizationMemberSchema>

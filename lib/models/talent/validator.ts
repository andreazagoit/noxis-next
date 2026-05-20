import { z } from 'zod'
import {
  TALENT_STATUSES,
  TALENT_SOCIAL_PLATFORMS,
} from '@/lib/models/talent/config'

const slugRegex = /^[a-z0-9-]+$/

const billingFieldsCreate = {
  fiscalCode: z.string().max(40).optional(),
  vatNumber: z.string().max(40).optional(),
  address: z.string().max(400).optional(),
  pec: z.string().max(200).optional(),
  sdiCode: z.string().max(20).optional(),
  billingEmail: z.string().max(200).optional(),
  iban: z.string().max(40).optional(),
}

const billingFieldsUpdate = {
  fiscalCode: z.string().max(40).nullable().optional(),
  vatNumber: z.string().max(40).nullable().optional(),
  address: z.string().max(400).nullable().optional(),
  pec: z.string().max(200).nullable().optional(),
  sdiCode: z.string().max(20).nullable().optional(),
  billingEmail: z.string().max(200).nullable().optional(),
  iban: z.string().max(40).nullable().optional(),
}

export const TalentSocialItemSchema = z.object({
  platform: z.enum(TALENT_SOCIAL_PLATFORMS),
  handle: z.string().min(1).max(120),
  url: z.string().max(400).nullable().optional(),
})

export const TalentCreateSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(120),
  displayName: z.string().min(1).max(120).optional(),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(slugRegex, 'Use only lowercase letters, numbers and dashes')
    .optional(),
  bio: z.string().max(2000).optional(),
  city: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  socials: z.array(TalentSocialItemSchema).default([]),
  ...billingFieldsCreate,
})

export const TalentUpdateSchema = z.object({
  displayName: z.string().min(1).max(120).optional(),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(slugRegex, 'Use only lowercase letters, numbers and dashes')
    .optional(),
  bio: z.string().max(2000).nullable().optional(),
  city: z.string().max(80).nullable().optional(),
  country: z.string().max(80).nullable().optional(),
  ...billingFieldsUpdate,
})

export const TalentAdminUpdateSchema = TalentUpdateSchema.extend({
  notes: z.string().max(4000).nullable().optional(),
  status: z.enum(TALENT_STATUSES).optional(),
})

export type TalentCreateInput = z.input<typeof TalentCreateSchema>
export type TalentUpdateInput = z.input<typeof TalentUpdateSchema>
export type TalentAdminUpdateInput = z.input<typeof TalentAdminUpdateSchema>
export type TalentSocialItemInput = z.input<typeof TalentSocialItemSchema>

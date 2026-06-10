import { z } from 'zod'
import { LEAD_SECTORS, LEAD_EMPLOYEE_BANDS } from '@/lib/models/lead/config'

export const LeadCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional(),
  sector: z.enum(LEAD_SECTORS).optional(),
  employees: z.enum(LEAD_EMPLOYEE_BANDS).optional(),
  score: z.number().int().min(0).max(20).optional(),
  answers: z.array(z.number().int().min(0).max(2)).max(20).optional(),
  locale: z.string().max(10).optional(),
  // Honeypot field: real users never fill it.
  website: z.string().max(200).optional(),
})

export type LeadCreateInput = z.input<typeof LeadCreateSchema>

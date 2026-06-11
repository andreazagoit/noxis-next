import { z } from 'zod'
import { LEAD_SECTORS, LEAD_EMPLOYEE_BANDS, CHECK_AREAS } from '@/lib/models/lead/config'

export const LeadCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  // Normalizzato in E.164 e validato con z.e164(): "+39 333 123 4567",
  // "0039333..." e "333 123 4567" diventano tutti "+39333...". Il max(40)
  // è solo un tetto sull'input grezzo prima della normalizzazione.
  phone: z
    .string()
    .max(40)
    .transform((v) => {
      const digits = v.replace(/\D/g, '')
      if (v.trim().startsWith('+')) return `+${digits}`
      if (digits.startsWith('00')) return `+${digits.slice(2)}`
      // Senza prefisso internazionale assumiamo l'Italia: è il pubblico del sito.
      return `+39${digits}`
    })
    .pipe(z.e164()),
  company: z.string().max(200).optional(),
  sector: z.enum(LEAD_SECTORS).optional(),
  employees: z.enum(LEAD_EMPLOYEE_BANDS).optional(),
  score: z.number().int().min(0).max(40).optional(),
  answers: z.array(z.number().int().min(0).max(2)).max(40).optional(),
  areas: z
    .array(z.object({ key: z.enum(CHECK_AREAS), value: z.number().int().min(0).max(2) }))
    .max(20)
    .optional(),
  locale: z.string().max(10).optional(),
  // Honeypot field: real users never fill it.
  website: z.string().max(200).optional(),
})

export type LeadCreateInput = z.input<typeof LeadCreateSchema>

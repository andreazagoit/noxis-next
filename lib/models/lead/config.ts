/**
 * Lead domain values (AI Readiness Check + future lead sources).
 */

export const LEAD_SOURCES = ['ai-check', 'contact'] as const

export type LeadSource = (typeof LEAD_SOURCES)[number]

export const LEAD_SECTORS = ['services', 'manufacturing', 'retail', 'other'] as const

export type LeadSector = (typeof LEAD_SECTORS)[number]

export const LEAD_EMPLOYEE_BANDS = ['micro', 'small', 'medium', 'large'] as const

export type LeadEmployeeBand = (typeof LEAD_EMPLOYEE_BANDS)[number]

export const LEAD_STATUSES = ['new', 'contacted', 'closed'] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

/** Aree di processo esplorate dal Check AI: la "mappa" di cosa si può automatizzare. */
export const CHECK_AREAS = [
  'quotes',
  'email',
  'documents',
  'data_entry',
  'knowledge',
  'planning',
] as const

export type CheckArea = (typeof CHECK_AREAS)[number]

/** Risposta dell'utente su un'area (0 = poco o niente, 1 = un po', 2 = parecchio). */
export interface LeadAreaEntry {
  key: CheckArea
  value: number
}

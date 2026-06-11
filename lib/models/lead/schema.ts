import { db } from '@/lib/db'
import type {
  LeadSource,
  LeadSector,
  LeadEmployeeBand,
  LeadStatus,
  LeadAreaEntry,
} from '@/lib/models/lead/config'

export type { LeadSource, LeadSector, LeadEmployeeBand, LeadStatus, LeadAreaEntry, CheckArea } from '@/lib/models/lead/config'

// ────────────────────────────────────────────────────────────────────
// LEAD
// Captured from the public site (AI Readiness Check). No auth involved.
// ────────────────────────────────────────────────────────────────────

/** Documento lead come salvato in MongoDB (collection `leads`, _id = UUID). */
export interface DbLead {
  _id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  sector: LeadSector | null
  employees: LeadEmployeeBand | null
  score: number | null
  /** Risposte grezze del check (array di 0|1|2), tenute per il follow-up. */
  answers: number[] | null
  /** Mappa delle aree di processo: quanto pesa ciascuna secondo l'utente. */
  areas: LeadAreaEntry[] | null
  locale: string | null
  source: LeadSource
  status: LeadStatus
  createdAt: Date
}

export function leadsCollection() {
  return db.collection<DbLead>('leads')
}

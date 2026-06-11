import type { CheckArea } from '@/lib/models/lead/config'

/**
 * Struttura del Check AI: 2 domande di contesto + 6 aree di processo.
 * L'ordine è allineato 1:1 a check.questions nei locale.
 * Le domande `area` chiedono quanto pesa quel processo (0|1|2) e le risposte
 * diventano la "mappa" mostrata nel risultato e salvata nel lead.
 */
export type CheckQuestionMeta =
  | { kind: 'context' }
  | { kind: 'area'; area: CheckArea }

export const CHECK_QUESTIONS: readonly CheckQuestionMeta[] = [
  { kind: 'context' },                    // gestionale usato tutti i giorni
  { kind: 'context' },                    // documentazione ordinata
  { kind: 'area', area: 'quotes' },       // preventivi e offerte
  { kind: 'area', area: 'email' },        // email e richieste clienti
  { kind: 'area', area: 'documents' },    // documenti ricorrenti
  { kind: 'area', area: 'data_entry' },   // dati copiati a mano
  { kind: 'area', area: 'knowledge' },    // domande interne ripetitive
  { kind: 'area', area: 'planning' },     // scadenze e pianificazione
] as const

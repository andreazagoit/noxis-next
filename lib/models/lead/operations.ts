'use server'

import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { lead } from '@/lib/models'
import { LEAD_STATUSES } from '@/lib/models/lead/config'
import { requireAdmin } from '@/lib/auth-utils'

export async function listLeads() {
  await requireAdmin()
  return db.query.lead.findMany({ orderBy: [desc(lead.createdAt)] })
}

const UpdateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(LEAD_STATUSES),
})

export async function updateLeadStatus(input: z.input<typeof UpdateStatusSchema>) {
  await requireAdmin()
  const { id, status } = UpdateStatusSchema.parse(input)
  await db.update(lead).set({ status }).where(eq(lead.id, id))
  revalidatePath('/dashboard')
}

export async function deleteLead(id: string) {
  await requireAdmin()
  await db.delete(lead).where(eq(lead.id, z.string().min(1).parse(id)))
  revalidatePath('/dashboard')
}

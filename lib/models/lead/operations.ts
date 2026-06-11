'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { leadsCollection } from '@/lib/models/lead/schema'
import { LEAD_STATUSES } from '@/lib/models/lead/config'
import { requireAdmin } from '@/lib/auth-utils'

export async function listLeads() {
  await requireAdmin()
  const docs = await leadsCollection().find().sort({ createdAt: -1 }).toArray()
  return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
}

const UpdateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(LEAD_STATUSES),
})

export async function updateLeadStatus(input: z.input<typeof UpdateStatusSchema>) {
  await requireAdmin()
  const { id, status } = UpdateStatusSchema.parse(input)
  await leadsCollection().updateOne({ _id: id }, { $set: { status } })
  revalidatePath('/dashboard')
}

export async function deleteLead(id: string) {
  await requireAdmin()
  await leadsCollection().deleteOne({ _id: z.string().min(1).parse(id) })
  revalidatePath('/dashboard')
}

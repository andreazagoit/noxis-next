import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export type AppSession = Awaited<ReturnType<typeof auth.api.getSession>>

export async function getCurrentSession(): Promise<AppSession> {
  return auth.api.getSession({ headers: await nextHeaders() })
}

export async function requireSession() {
  const session = await getCurrentSession()
  if (!session) redirect('/sign-in')
  return session
}

export async function requireAdmin() {
  const session = await requireSession()
  const role = (session.user as { role?: string }).role
  if (role !== 'admin') redirect('/dashboard')
  return session
}

export function getUserRole(session: { user: unknown } | null): string | null {
  if (!session) return null
  return (session.user as { role?: string }).role ?? null
}

export function isAdmin(session: { user: unknown } | null): boolean {
  return getUserRole(session) === 'admin'
}

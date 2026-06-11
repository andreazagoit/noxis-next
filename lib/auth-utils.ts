import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/auth'

/** L'unica sessione possibile è quella dell'admin (credenziali in env). */
export type AppSession = { email: string } | null

export async function getCurrentSession(): Promise<AppSession> {
  if (await hasAdminSession()) {
    return { email: process.env.ADMIN_EMAIL ?? 'admin' }
  }
  return null
}

export async function requireAdmin(): Promise<void> {
  if (!(await hasAdminSession())) redirect('/sign-in')
}

export function isAdmin(session: AppSession): boolean {
  return session !== null
}

import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/auth-utils'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession()
  if (!session) redirect('/sign-in')

  return <div className="mx-auto w-full max-w-5xl px-6 pt-24 pb-16">{children}</div>
}

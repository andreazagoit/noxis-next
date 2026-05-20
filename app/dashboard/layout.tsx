import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import {
  getCurrentSession,
  getUserRole,
  getActiveOrganizationId,
} from '@/lib/auth-utils'
import { listMyOrganizations, setActiveOrganization } from '@/lib/models/member/operations'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession()
  if (!session) redirect('/sign-in')
  const role = getUserRole(session)
  const organizations = await listMyOrganizations()
  let activeId = getActiveOrganizationId(session)

  // Auto-select if user has exactly one organization and no active one set
  if (!activeId && organizations.length === 1) {
    await setActiveOrganization(organizations[0].id)
    activeId = organizations[0].id
  }

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-[calc(100svh-4rem)]">
        <DashboardSidebar
          role={role}
          organizations={organizations}
          activeOrganizationId={activeId}
        />
        <SidebarInset className="mt-16">
          <div className="md:hidden sticky top-16 z-10 flex items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur-md px-4 py-2">
            <SidebarTrigger />
          </div>
          <div className="flex-1 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

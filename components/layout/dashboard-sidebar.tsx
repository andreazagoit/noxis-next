'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  Building2,
  User,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { OrganizationSwitcher } from '@/components/layout/organization-switcher'
import type { MyOrganization } from '@/lib/models/member/operations'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const ADMIN_MAIN_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/organizations', label: 'Organizations', icon: Building2 },
  { href: '/dashboard/projects', label: 'Projects', icon: Briefcase },
]

const USER_MAIN_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

const SETTINGS_NAV: NavItem[] = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface Props {
  role: string | null
  organizations: MyOrganization[]
  activeOrganizationId: string | null
}

export function DashboardSidebar({ role, organizations, activeOrganizationId }: Props) {
  const pathname = usePathname()
  const mainNav = role === 'admin' ? ADMIN_MAIN_NAV : USER_MAIN_NAV

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <Sidebar collapsible="icon" className="top-16 h-[calc(100svh-4rem)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SETTINGS_NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {organizations.length > 0 && (
        <SidebarFooter className="p-2 group-data-[collapsible=icon]:hidden">
          <OrganizationSwitcher
            organizations={organizations}
            activeOrganizationId={activeOrganizationId}
          />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

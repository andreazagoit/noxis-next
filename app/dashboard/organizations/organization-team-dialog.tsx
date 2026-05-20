'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Combobox } from '@/components/ui/combobox'
import {
  addExistingUserToOrganization,
  getOrganizationById,
  listOrganizationMembers,
  removeOrganizationMember,
  type OrganizationMember,
} from '@/lib/models/organization/operations'
import { listUsers, type UserListRow } from '@/lib/models/user/operations'

import {
  ORGANIZATION_MEMBER_ROLES,
  type OrganizationMemberRole,
} from '@/lib/models/member/config'

type View = 'members' | 'add'
type MemberRole = OrganizationMemberRole

interface Props {
  organizationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrganizationTeamDialog({ organizationId, open, onOpenChange }: Props) {
  const router = useRouter()
  const [view, setView] = useState<View>('members')
  const [orgName, setOrgName] = useState<string>('')
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [users, setUsers] = useState<UserListRow[]>([])
  const [loading, setLoading] = useState(false)

  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null)
  const [pendingRemove, startRemove] = useTransition()

  const [selectedUserId, setSelectedUserId] = useState('')
  const [role, setRole] = useState<MemberRole>('member')
  const [addError, setAddError] = useState<string | null>(null)
  const [pendingAdd, startAdd] = useTransition()

  useEffect(() => {
    if (!open || !organizationId) return
    let cancelled = false
    setLoading(true)
    Promise.all([
      getOrganizationById(organizationId),
      listOrganizationMembers(organizationId),
      listUsers(),
    ])
      .then(([b, m, u]) => {
        if (cancelled) return
        setOrgName(b?.name ?? '')
        setMembers(m)
        setUsers(u)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [open, organizationId])

  const refresh = async () => {
    if (!organizationId) return
    const [m, u] = await Promise.all([
      listOrganizationMembers(organizationId),
      listUsers(),
    ])
    setMembers(m)
    setUsers(u)
    router.refresh()
  }

  const handleRemove = (memberId: string, name: string) => {
    if (!confirm(`Remove ${name} from this organization?`)) return
    setPendingRemoveId(memberId)
    startRemove(async () => {
      await removeOrganizationMember(memberId)
      setPendingRemoveId(null)
      await refresh()
    })
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!organizationId || !selectedUserId) return
    setAddError(null)
    startAdd(async () => {
      const result = await addExistingUserToOrganization({
        organizationId,
        userId: selectedUserId,
        role,
      })
      if (!result.ok) {
        setAddError(result.error)
        return
      }
      await refresh()
      setSelectedUserId('')
      setRole('member')
      setView('members')
    })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setOrgName('')
      setMembers([])
      setUsers([])
      setSelectedUserId('')
      setRole('member')
      setAddError(null)
      setView('members')
    }
    onOpenChange(next)
  }

  const isLoading = loading || !orgName
  const memberUserIds = new Set(members.map((m) => m.userId))
  const availableUsers = users.filter((u) => !memberUserIds.has(u.id))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {isLoading ? (
          <>
            <DialogHeader>
              <DialogTitle>Team</DialogTitle>
              <DialogDescription>Loading...</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <div className="h-9 rounded-lg bg-muted/50 animate-pulse" />
              <div className="h-9 rounded-lg bg-muted/50 animate-pulse" />
              <div className="h-9 rounded-lg bg-muted/50 animate-pulse" />
            </div>
          </>
        ) : view === 'members' ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <DialogHeader className="flex-1">
                <DialogTitle>{orgName} — Team</DialogTitle>
                <DialogDescription>
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </DialogDescription>
              </DialogHeader>
              <Button onClick={() => setView('add')}>Add member</Button>
            </div>

            <div data-lenis-prevent className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
              {members.length === 0 ? (
                <Typography
                  variant="body"
                  className="text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl"
                >
                  No team members yet
                </Typography>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="w-0" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((m) => (
                        <TableRow key={m.memberId}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-muted-foreground">{m.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{m.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(m.memberId, m.name)}
                              disabled={pendingRemove && pendingRemoveId === m.memberId}
                            >
                              {pendingRemove && pendingRemoveId === m.memberId
                                ? '...'
                                : 'Remove'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView('members')}
                  className="rounded-md p-1 hover:bg-accent/50 transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="size-4" />
                </button>
                Add member to {orgName}
              </DialogTitle>
              <DialogDescription>
                Pick an existing user. Create a new one in Users if needed.
              </DialogDescription>
            </DialogHeader>

            <form
              id="add-member-form"
              onSubmit={handleAdd}
              className="flex flex-col gap-4 py-2"
            >
              <div className="flex flex-col gap-1.5">
                <Label>User</Label>
                <Combobox
                  items={availableUsers.map((u) => ({
                    value: u.id,
                    label: u.name,
                    description: u.email,
                  }))}
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                  placeholder={
                    availableUsers.length === 0
                      ? 'All users are already members'
                      : 'Select a user'
                  }
                  searchPlaceholder="Search by name or email..."
                  emptyMessage="No user found."
                  disabled={availableUsers.length === 0}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="add-member-role">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as MemberRole)}>
                  <SelectTrigger id="add-member-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_MEMBER_ROLES.map((r) => (
                      <SelectItem key={r} value={r} className="capitalize">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {addError && (
                <Typography variant="caption" className="text-red-500">
                  {addError}
                </Typography>
              )}
            </form>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setView('members')}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-member-form"
                disabled={pendingAdd || !selectedUserId}
              >
                {pendingAdd ? 'Adding...' : 'Add member'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

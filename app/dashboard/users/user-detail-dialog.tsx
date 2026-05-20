'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  deleteUser,
  getUserById,
  updateUser,
} from '@/lib/models/user/operations'

type UserDetail = Awaited<ReturnType<typeof getUserById>>
type Role = 'user' | 'admin'

interface Props {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailDialog({ userId, open, onOpenChange }: Props) {
  const router = useRouter()
  const [data, setData] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingSave, startSave] = useTransition()
  const [pendingDelete, startDelete] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState<
    { type: 'success' | 'error'; text: string } | null
  >(null)

  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('user')

  useEffect(() => {
    if (!open || !userId) return
    let cancelled = false
    setLoading(true)
    getUserById(userId)
      .then((d) => {
        if (cancelled) return
        setData(d ?? null)
        if (d) {
          setName(d.user.name)
          setRole((d.user.role as Role) ?? 'user')
        }
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [open, userId])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaveMessage(null)
    startSave(async () => {
      const result = await updateUser(userId, { name, role })
      if (!result.ok) {
        setSaveMessage({ type: 'error', text: 'Error saving' })
        return
      }
      setSaveMessage({ type: 'success', text: 'Saved' })
      const refreshed = await getUserById(userId)
      if (refreshed) setData(refreshed)
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (!data) return
    startDelete(async () => {
      await deleteUser(data.user.id)
      setConfirmOpen(false)
      onOpenChange(false)
      router.refresh()
    })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setData(null)
      setSaveMessage(null)
    }
    onOpenChange(next)
  }

  const isLoading = loading || !data
  const kind: 'admin' | 'talent' | 'user' = data
    ? data.user.role === 'admin'
      ? 'admin'
      : data.talent
        ? 'talent'
        : 'user'
    : 'user'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {isLoading || !data ? (
          <>
            <DialogHeader>
              <DialogTitle>User</DialogTitle>
              <DialogDescription>Loading...</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <div className="h-9 rounded-lg bg-muted/50 animate-pulse" />
              <div className="h-9 rounded-lg bg-muted/50 animate-pulse" />
              <div className="h-20 rounded-lg bg-muted/50 animate-pulse" />
            </div>
          </>
        ) : (
          <>
        <DialogHeader>
          <DialogTitle>{data.user.name}</DialogTitle>
          <DialogDescription>{data.user.email}</DialogDescription>
        </DialogHeader>

        <form
          id="user-detail-form"
          onSubmit={handleSave}
          data-lenis-prevent className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ud-name">Name</Label>
            <Input
              id="ud-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ud-role">Platform role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger id="ud-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
            <Typography variant="h4">
              Type
            </Typography>
            <Badge variant={kind === 'admin' ? 'default' : 'secondary'} className="self-start">
              {kind}
            </Badge>
            {data.talent && (
              <Typography variant="caption" className="text-muted-foreground">
                Talent profile linked: @{data.talent.slug}
              </Typography>
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
            <Typography variant="h4">
              Organizations
            </Typography>
            {data.memberships.length === 0 ? (
              <Typography variant="caption" className="text-muted-foreground">
                Not a member of any organization.
              </Typography>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {data.memberships.map((m) => (
                  <li key={m.memberId} className="flex items-center justify-between gap-2 text-sm">
                    <span>{m.orgName}</span>
                    <Badge variant="outline">{m.role}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmOpen(true)}
            disabled={pendingDelete}
            className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500"
          >
            {pendingDelete ? 'Deleting...' : 'Delete'}
          </Button>
          <div className="flex items-center gap-2">
            {saveMessage && (
              <Typography
                variant="caption"
                className={
                  saveMessage.type === 'success' ? 'text-emerald-500' : 'text-red-500'
                }
              >
                {saveMessage.text}
              </Typography>
            )}
            <Button type="submit" form="user-detail-form" disabled={pendingSave}>
              {pendingSave ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </DialogFooter>
          </>
        )}
      </DialogContent>

      {data && (
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {data.user.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the user account, talent profile (if any) and all org memberships. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pendingDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={pendingDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {pendingDelete ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )}
    </Dialog>
  )
}

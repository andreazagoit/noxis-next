'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/ui/typography'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createOrganization } from '@/lib/models/organization/operations'

export function NewOrganizationDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')

  const reset = () => {
    setName('')
    setError(null)
  }

  const onOpenChange = (next: boolean) => {
    if (!next) reset()
    setOpen(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createOrganization({ name })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setOpen(false)
      reset()
      router.refresh()
    })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New organization</Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New organization</DialogTitle>
            <DialogDescription>
              Create a organization client. You can invite team members afterward.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="organization-name">Organization name</Label>
              <Input
                id="organization-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lego"
              />
            </div>

            {error && (
              <Typography variant="caption" className="text-red-500">
                {error}
              </Typography>
            )}

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Creating...' : 'Create organization'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

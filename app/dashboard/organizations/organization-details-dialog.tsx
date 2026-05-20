'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  deleteOrganization,
  getOrganizationById,
  updateOrganization,
} from '@/lib/models/organization/operations'

type Organization = Awaited<ReturnType<typeof getOrganizationById>>

interface Props {
  organizationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrganizationDetailsDialog({ organizationId, open, onOpenChange }: Props) {
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingSave, startSave] = useTransition()
  const [pendingDelete, startDelete] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState<
    { type: 'success' | 'error'; text: string } | null
  >(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [legalName, setLegalName] = useState('')
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [pec, setPec] = useState('')
  const [sdiCode, setSdiCode] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!open || !organizationId) return
    let cancelled = false
    setLoading(true)
    getOrganizationById(organizationId)
      .then((b) => {
        if (cancelled) return
        setOrganization(b ?? null)
        if (b) {
          setName(b.name)
          setSlug(b.slug)
          setLegalName(b.legalName ?? '')
          setCountry(b.country ?? '')
          setAddress(b.address ?? '')
          setVatNumber(b.vatNumber ?? '')
          setPec(b.pec ?? '')
          setSdiCode(b.sdiCode ?? '')
          setBillingEmail(b.billingEmail ?? '')
          setNotes(b.notes ?? '')
        }
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [open, organizationId])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!organizationId) return
    setSaveMessage(null)
    startSave(async () => {
      const result = await updateOrganization(organizationId, {
        name,
        slug,
        legalName: legalName || null,
        country: country || null,
        address: address || null,
        vatNumber: vatNumber || null,
        pec: pec || null,
        sdiCode: sdiCode || null,
        billingEmail: billingEmail || null,
        notes: notes || null,
      })
      if (!result.ok) {
        setSaveMessage({ type: 'error', text: 'Error saving' })
        return
      }
      setSaveMessage({ type: 'success', text: 'Saved' })
      const refreshed = await getOrganizationById(organizationId)
      if (refreshed) setOrganization(refreshed)
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (!organization) return
    setDeleteError(null)
    startDelete(async () => {
      const result = await deleteOrganization(organization.id)
      if (!result.ok) {
        setDeleteError(result.error)
        setConfirmOpen(false)
        return
      }
      setConfirmOpen(false)
      onOpenChange(false)
      router.refresh()
    })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setOrganization(null)
      setSaveMessage(null)
      setDeleteError(null)
    }
    onOpenChange(next)
  }

  const isLoading = loading || !organization

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {isLoading ? (
          <>
            <DialogHeader>
              <DialogTitle>Details</DialogTitle>
              <DialogDescription>Loading...</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <div className="h-9 rounded-lg bg-muted/50 animate-pulse" />
              <div className="h-9 rounded-lg bg-muted/50 animate-pulse" />
              <div className="h-20 rounded-lg bg-muted/50 animate-pulse" />
              <div className="h-9 rounded-lg bg-muted/50 animate-pulse" />
            </div>
          </>
        ) : (
          <>
        <DialogHeader>
          <DialogTitle>Organization details</DialogTitle>
          <DialogDescription>
            Edit anagraphic and billing details for {organization.name}.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSave}
          id="organization-details-form"
          data-lenis-prevent className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto -mr-4 pr-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organization-name">Organization name</Label>
              <Input
                id="organization-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organization-slug">Slug</Label>
              <Input
                id="organization-slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                pattern="[a-z0-9-]+"
                placeholder="acme"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organization-legal">Legal name</Label>
            <Input
              id="organization-legal"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="Acme S.r.l."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organization-country">Country</Label>
              <Input
                id="organization-country"
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="IT"
                maxLength={2}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="organization-vat">VAT / P.IVA</Label>
              <Input
                id="organization-vat"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="IT12345678901"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organization-address">Address</Label>
            <Textarea
              id="organization-address"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Via Roma 1, 20121 Milano"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organization-pec">PEC (IT)</Label>
              <Input
                id="organization-pec"
                type="email"
                value={pec}
                onChange={(e) => setPec(e.target.value)}
                placeholder="org@pec.example.it"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organization-sdi">Codice SDI (IT)</Label>
              <Input
                id="organization-sdi"
                value={sdiCode}
                onChange={(e) => setSdiCode(e.target.value.toUpperCase())}
                placeholder="ABC1234"
                maxLength={7}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organization-billing">Billing email</Label>
            <Input
              id="organization-billing"
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="ap@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organization-notes">Notes (admin only)</Label>
            <Textarea
              id="organization-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
            <Button type="submit" form="organization-details-form" disabled={pendingSave}>
              {pendingSave ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </DialogFooter>
          </>
        )}
      </DialogContent>

      {organization && (
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {organization.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the organization along with its memberships, projects and
              events. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <Typography variant="caption" className="text-red-500">
              {deleteError}
            </Typography>
          )}
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

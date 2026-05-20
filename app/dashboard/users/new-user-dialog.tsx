'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { createUser } from '@/lib/models/user/operations'
import { createTalent } from '@/lib/models/talent/operations'
import {
  TALENT_SOCIAL_PLATFORMS,
  TALENT_SOCIAL_PLATFORM_META,
  type TalentSocialPlatform,
} from '@/lib/models/talent/config'

type Kind = 'user' | 'admin' | 'talent'

const KIND_META: Record<Kind, { label: string; description: string }> = {
  user: {
    label: 'User',
    description: 'A standard user. Sign-in only, no talent profile.',
  },
  admin: {
    label: 'Admin',
    description: 'Full access to the agency dashboard.',
  },
  talent: {
    label: 'Talent',
    description: 'Creator/influencer. A talent profile will be created alongside the user.',
  },
}

type SocialRow = { platform: TalentSocialPlatform; handle: string; url: string }

export function NewUserDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [kind, setKind] = useState<Kind>('user')

  // Talent-only fields
  const [displayName, setDisplayName] = useState('')
  const [slug, setSlug] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [socials, setSocials] = useState<SocialRow[]>([])

  // Billing
  const [fiscalCode, setFiscalCode] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [address, setAddress] = useState('')
  const [pec, setPec] = useState('')
  const [sdiCode, setSdiCode] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [iban, setIban] = useState('')

  const reset = () => {
    setEmail('')
    setName('')
    setKind('user')
    setDisplayName('')
    setSlug('')
    setBio('')
    setCity('')
    setCountry('')
    setSocials([])
    setFiscalCode('')
    setVatNumber('')
    setAddress('')
    setPec('')
    setSdiCode('')
    setBillingEmail('')
    setIban('')
    setError(null)
  }

  const onOpenChange = (next: boolean) => {
    if (!next) reset()
    setOpen(next)
  }

  const addSocial = () =>
    setSocials((prev) => [...prev, { platform: 'instagram', handle: '', url: '' }])
  const updateSocial = (idx: number, patch: Partial<SocialRow>) =>
    setSocials((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  const removeSocial = (idx: number) =>
    setSocials((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result =
        kind === 'talent'
          ? await createTalent({
              email,
              name,
              displayName: displayName || undefined,
              slug: slug || undefined,
              bio: bio || undefined,
              city: city || undefined,
              country: country || undefined,
              fiscalCode: fiscalCode || undefined,
              vatNumber: vatNumber || undefined,
              address: address || undefined,
              pec: pec || undefined,
              sdiCode: sdiCode || undefined,
              billingEmail: billingEmail || undefined,
              iban: iban || undefined,
              socials: socials
                .filter((s) => s.handle.trim().length > 0)
                .map((s) => ({
                  platform: s.platform,
                  handle: s.handle.trim(),
                  url: s.url.trim() || null,
                })),
            })
          : await createUser({ email, name, role: kind })

      if (!result.ok) {
        setError(result.error)
        return
      }
      setOpen(false)
      reset()
      router.refresh()
    })
  }

  const isTalent = kind === 'talent'

  return (
    <>
      <Button onClick={() => setOpen(true)}>New user</Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={isTalent ? 'sm:max-w-2xl' : 'sm:max-w-md'}>
          <DialogHeader>
            <DialogTitle>New user</DialogTitle>
            <DialogDescription>{KIND_META[kind].description}</DialogDescription>
          </DialogHeader>

          <form
            id="new-user-form"
            onSubmit={handleSubmit}
            data-lenis-prevent
            className="flex flex-col gap-4 py-2 max-h-[65vh] overflow-y-auto pr-1"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-kind">Kind</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as Kind)}>
                <SelectTrigger id="user-kind" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(KIND_META) as Kind[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {KIND_META[k].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="someone@example.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="user-name">Full name</Label>
                <Input
                  id="user-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mario Rossi"
                />
              </div>
            </div>

            {isTalent && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="talent-display">Display name (optional)</Label>
                    <Input
                      id="talent-display"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Falls back to full name"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="talent-slug">Slug (optional)</Label>
                    <Input
                      id="talent-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      placeholder="mario-rossi"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="talent-bio">Description (optional)</Label>
                  <Textarea
                    id="talent-bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Niche, tone, anything to know about this talent..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="talent-city">City (optional)</Label>
                    <Input
                      id="talent-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="talent-country">Country (optional)</Label>
                    <Input
                      id="talent-country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <Label>Social accounts</Label>
                      <p className="text-xs text-muted-foreground">
                        One row per platform. Add as many as needed.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSocial}
                    >
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </div>

                  {socials.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {socials.map((s, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[8rem_1fr_1fr_auto] gap-2 items-center"
                        >
                          <Select
                            value={s.platform}
                            onValueChange={(v) =>
                              updateSocial(idx, { platform: v as TalentSocialPlatform })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TALENT_SOCIAL_PLATFORMS.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {TALENT_SOCIAL_PLATFORM_META[p].label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={s.handle}
                            onChange={(e) => updateSocial(idx, { handle: e.target.value })}
                            placeholder="username"
                          />
                          <Input
                            value={s.url}
                            onChange={(e) => updateSocial(idx, { url: e.target.value })}
                            placeholder="https://..."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSocial(idx)}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
                  <div className="flex flex-col gap-1">
                    <Label>Billing</Label>
                    <p className="text-xs text-muted-foreground">
                      Fiscal & invoicing details. All optional, fill what you have.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="bill-fiscal">Fiscal code</Label>
                      <Input
                        id="bill-fiscal"
                        value={fiscalCode}
                        onChange={(e) => setFiscalCode(e.target.value.toUpperCase())}
                        placeholder="RSSMRA85M01H501Z"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="bill-vat">VAT number</Label>
                      <Input
                        id="bill-vat"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        placeholder="IT01234567890"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="bill-address">Address</Label>
                    <Input
                      id="bill-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Via Roma 1, 20100 Milano (MI)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="bill-pec">PEC</Label>
                      <Input
                        id="bill-pec"
                        type="email"
                        value={pec}
                        onChange={(e) => setPec(e.target.value)}
                        placeholder="name@pec.it"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="bill-sdi">SDI code</Label>
                      <Input
                        id="bill-sdi"
                        value={sdiCode}
                        onChange={(e) => setSdiCode(e.target.value.toUpperCase())}
                        placeholder="0000000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="bill-email">Billing email</Label>
                      <Input
                        id="bill-email"
                        type="email"
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        placeholder="billing@example.com"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="bill-iban">IBAN</Label>
                      <Input
                        id="bill-iban"
                        value={iban}
                        onChange={(e) => setIban(e.target.value.toUpperCase())}
                        placeholder="IT60X0542811101000000123456"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
          </form>

          <DialogFooter>
            <Button type="submit" form="new-user-form" disabled={pending}>
              {pending ? 'Creating...' : 'Create user'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
